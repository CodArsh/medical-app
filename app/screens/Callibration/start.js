/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StatusBar, DeviceEventEmitter, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import EyeTracking from '@redux/reducers/eyeTracking/actions';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';
import {
  init,
  stopTracking,
  calculateAveragePosition,
  calculateScreenX,
  calculateScreenY,
  ET_DEFAULTS,
  validateLighting,
  remapEventObject,
} from '@utils/eyeTracking';
import { getDate } from '@utils/CommonFunction';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import { captureScreen } from 'react-native-view-shot';

let currentIndexEyeTracking1 = [];
let accuracy = {};

const baseUrl = __DEV__
  ? 'http://192.168.2.153:4000'
  : 'https://eyetracking-api.oculabs.com';

Animatable.initializeRegistryWithDefinitions({
  customPulse: {
    from: {
      transform: [{ scale: 1 }],
      backgroundColor: BaseColors.primaryBlue,
    },
    to: {
      transform: [{ scale: 1.2 }],
      backgroundColor: BaseColors.black,
    },
  },
});

let lastPosition = 'CENTER';
let CALIBRATED_POSITIONS = {
  CENTER: { x: [], y: [] },
  TL: { x: [], y: [] },
  TR: { x: [], y: [] },
  BR: { x: [], y: [] },
  BL: { x: [], y: [] },
};
let TRACK_EYES = false;
let timeoutVar = null;

const emptyCalibrations = {
  CENTER: null,
  TL: null,
  TR: null,
  BR: null,
  BL: null,
};

let lastEyeTrackEvent = null;

export default function CalibrationStart({ route, navigation }) {
  const routeParams = route?.params;
  const insets = useSafeAreaInsets();
  const [caliType, setCaliType] = useState('calibrateMap');
  const {
    setCalibration,
    resetCalibration,
    setCalibrationGaze,
    resetCalibrationGaze,
    setCheckAttempt,
  } = EyeTracking;
  const { userData } = useSelector(state => {
    return state.auth;
  });
  const { calibrationTime, calibration, checkAttempt } = useSelector(state => {
    return state.eyeTracking;
  });
  const dispatch = useDispatch();

  const animatedValue = useSharedValue(0);
  const tXValue = useSharedValue(0);
  const tYValue = useSharedValue(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);
  const [showingToast, setShowingToast] = useState(false);
  const [dynamicDot, setDynamicDot] = useState(true);
  const [lightsPassed, setLightsPassed] = useState(false);
  const [caliStatus, setCaliStatus] = useState(true);
  let calibrations = emptyCalibrations;
  const [positionArray, setPositionArray] = useState({});

  const eventBlinkCountRef = useRef(0);
  const questionBlinkCountRef = useRef(0);

  const aoiXY = useRef([]);
  const bgImageURI = useRef(null);
  const [deviceName, setDeviceName] = useState(null);
  const aoiRootView = useRef(null);

  // Let's stop Native Eye Tracking when user navigates back
  useFocusEffect(
    useCallback(() => {
      if (lightsPassed && !dynamicDot) {
        TRACK_EYES = true;
        startCalibration();
      }
      if (viewWidth !== 0 && dynamicDot) {
        setTimeout(() => captureSS(), 2000);
      }

      !dynamicDot && init();
      return () => {
        stopTracking();
        currentIndexEyeTracking1 = [];
        accuracy = {};
      };
    }, [lightsPassed, dynamicDot, viewWidth]),
  );

  // On Screen Init
  useFocusEffect(
    React.useCallback(() => {
      let eventCount = 0; // Counter to track the number of events received
      let timeoutId; // Reference to the timeout
      setPositionArray({
        TL: {
          left: ET_DEFAULTS.pL,
          top: ET_DEFAULTS.pT,
        },
        TR: {
          left: viewWidth - (ET_DEFAULTS.dot_width + ET_DEFAULTS.pR),
          top: ET_DEFAULTS.pT,
        },
        BL: {
          left: ET_DEFAULTS.pL,
          top: viewHeight - ET_DEFAULTS.dot_height,
        },
        BR: {
          left: viewWidth - (ET_DEFAULTS.dot_width + ET_DEFAULTS.pR),
          top: viewHeight - ET_DEFAULTS.dot_height,
        },
        CENTER: {
          left: viewWidth / 2 - ET_DEFAULTS.dot_width / 2,
          top: viewHeight / 2 - ET_DEFAULTS.dot_height / 2,
        },
      });

      const trackListener = event => {
        lastEyeTrackEvent = event;
        // EyeTrackingCmp.setDebugInfo(event);
        if (!caliStatus || !event) {
          return;
        }

        // Let's log X and Y for Calibration
        if (TRACK_EYES) {
          // Adding Eye Gaze X and Y to the Array of Calibrated Data

          CALIBRATED_POSITIONS[lastPosition].totalBlinks = 0;

          if (!CALIBRATED_POSITIONS[lastPosition].eyeData) {
            CALIBRATED_POSITIONS[lastPosition].eyeData = {
              eyeDataOverTime: [],
            };
            CALIBRATED_POSITIONS[lastPosition].totalBlinks = 0;
          }

          const calPosToCalc =
            caliType === 'calibrationGaze' ? calibration : CALIBRATED_POSITIONS;

          const newXValue = calculateScreenX(
            event.centerEyeLookAtPoint.x,
            calPosToCalc,
            viewWidth,
          );
          const newYValue = calculateScreenY(
            event.centerEyeLookAtPoint.y,
            calPosToCalc,
            viewHeight,
          );

          CALIBRATED_POSITIONS[lastPosition].eyeData.eyeDataOverTime.push({
            eventData: remapEventObject(event),
            screenX: newXValue,
            screenY: newYValue,
            actualX: event.centerEyeLookAtPoint.x,
            actualY: event.centerEyeLookAtPoint.y,
            time: new Date().getTime(),
            dateTime: getDate(),
          });

          currentIndexEyeTracking1.push({
            // ...event,
            screenX: newXValue,
            screenY: newYValue,
            actualX: event.centerEyeLookAtPoint.x,
            actualY: event.centerEyeLookAtPoint.y,
            time: new Date().getTime(),
            dateTime: getDate(),
          });

          // CALIBRATED_POSITIONS[lastPosition].allPoints.push(event);
          CALIBRATED_POSITIONS[lastPosition].x.push(
            event.centerEyeLookAtPoint.x,
          );
          CALIBRATED_POSITIONS[lastPosition].y.push(
            event.centerEyeLookAtPoint.y,
          );
          // Let's update total blinks
          CALIBRATED_POSITIONS[lastPosition].totalBlinks =
            questionBlinkCountRef?.current;

          if (eventBlinkCountRef?.current !== event.totalBlinks) {
            questionBlinkCountRef.current = questionBlinkCountRef.current + 1;
            eventBlinkCountRef.current = event.totalBlinks;
          }

          if (questionBlinkCountRef?.current > 3) {
            if (checkAttempt < 1) {
              dispatch(setCheckAttempt(checkAttempt + 1));
              if (caliType === 'calibrationGaze') {
                setCaliType('calibrateMap');
              }
              stopCalibration();

              setCaliStatus(false);
              setTimeout(() => {
                setCaliStatus(true);
              }, 1000);

              Toast.show({
                text1:
                  'Blink error, restarting calibration. Please remain still and try to key eyes open during calibration',
                // text2: 'Please restart to continue.',
                type: 'error',
              });
            } else {
              stopCalibration();
              setCaliStatus(false);
              navigation?.navigate('Symptoms', { event_id: 126 });
              Toast.show({
                text1: 'Blink failed again!',
                // text2: 'Please restart to continue.',
                type: 'error',
              });
            }
          }
        }
        eventCount++;
      };

      // Let's listen to Tracking Event
      const subscription = DeviceEventEmitter.addListener(
        'eyeTrackingEvent',
        trackListener,
      );

      timeoutId = setInterval(() => {
        if (eventCount < 20 && !dynamicDot) {
          if (checkAttempt < 1) {
            dispatch(setCheckAttempt(checkAttempt + 1));
            navigation.goBack();
            stopCalibration();
            setCaliStatus(false);
            Toast.show({
              text1: 'Calibration failed! Please do not move your head',
              type: 'error',
            });
          } else {
            stopCalibration();
            setCaliStatus(false);
            navigation?.navigate('Symptoms', { event_id: 126 });
            Toast.show({
              text1: 'Calibration failed again!',
              type: 'error',
            });
          }
        } else {
          eventCount = 0;
        }
      }, 1000);
      return () => {
        clearInterval(timeoutId);
        subscription.remove();
      };
    }, [
      viewWidth,
      viewHeight,
      lastPosition,
      TRACK_EYES,
      calibration,
      caliType,
      checkAttempt,
    ]),
  );

  // Let's call functions one by one
  useEffect(() => {
    const getViewMeasurements = async () => {
      return new Promise((resolve, reject) => {
        if (aoiRootView.current) {
          aoiRootView.current.measure(
            (rx, ry, rwidth, rheight, rpageX, rpageY) => {
              aoiXY.current = [
                ...aoiXY?.current,
                {
                  screen: Dimensions.get('window'),
                  rootY: rpageY,
                },
              ];
              resolve(true);
            },
          );
        } else {
          console.log('Sym Called ===> View Ref not found');
        }
      });
    };

    getViewMeasurements();
  }, []);

  useEffect(() => {
    // Let's Start Calibration once we get the View's Height and Width
    console.log('View Width / Cali Status Updated : ', viewWidth, caliStatus);
    // Let's disable Start
    if (caliStatus && !dynamicDot) {
      if (viewWidth > 0) {
        // On Screen Init let's clear Redux
        if (caliType === 'calibrateMap') {
          dispatch(resetCalibration());
        } else {
          dispatch(resetCalibrationGaze());
        }
        console.log('TRACK_EYES => YES');
        TRACK_EYES = true;
        startCalibration();
      }
    } else {
      console.log('TRACK_EYES => NO');
      TRACK_EYES = false;
      stopCalibration();
    }
  }, [caliStatus, viewWidth, dynamicDot]);

  const nextCalibration = () => {
    const keys = Object.keys(calibrations);
    console.log('nextCalibration => keys: ', keys);
    console.log('nextCalibration => keys Cals: ', calibrations);

    for (const key of keys) {
      if (calibrations[key] === null) {
        return key;
      }
    }

    if (lastPosition !== 'CENTER') {
      console.log('nextCalibration => TRACK_EYES => NO');
      TRACK_EYES = false;
      return 'CENTER';
    }

    return null;
  };

  DeviceInfo.getDeviceName().then(dName => {
    setDeviceName(dName);
  });

  // Uploading Assessment Data to Server
  const handleUploadAssessmentData = async () => {
    try {
      const apiUrl = `${baseUrl}/store-assessment`; // Replace with your API endpoint

      // Sample data to be uploaded (modify as needed)
      const formData = new FormData();
      formData.append('deviceBackgroundImage', {
        uri: bgImageURI?.current,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formData.append('assessmentId', Math.random().toString(36).substr(2, 10));
      formData.append(
        'userName',
        `${userData?.firstname} ${userData?.lastname}`,
      );
      formData.append('deviceModel', DeviceInfo.getModel());
      formData.append('deviceName', `${deviceName} ${caliType}`);
      formData.append('deviceSize', JSON.stringify(Dimensions.get('window')));

      formData.append(
        'aoiJson',
        JSON.stringify({
          aoiXY: aoiXY?.current,
          eyeData: currentIndexEyeTracking1,
          calibrateMap: calibration,
          calibrateGaze: CALIBRATED_POSITIONS,
          accuracy: accuracy,
        }),
      );
      formData.append('dateTime', getDate());

      console.log('Handle Assessment: Data', formData);

      // Make the POST request using Axios
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response from the server
      console.log('Handle Assessment: Response from server:', response.data);
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Handle Assessment: Error uploading data:', error);
    }
  };

  const captureSS = () => {
    return new Promise((resolve, reject) => {
      // console.log('Sym Called ===> Capture SS');
      captureScreen({
        format: 'jpg',
        quality: 0.7,
      }).then(
        uri => {
          console.log('Sym Called ===> Capture SS Done');
          // console.log('AOI XY Updated Image saved to', uri);
          bgImageURI.current = uri;
          setDynamicDot(false);
          resolve(true);
        },
        error => {
          console.error('AOI XY Updated Image Oops, snapshot failed', error);
          resolve(false);
        },
      );
    });
  };

  // Function to handle going back and forward
  const handleNavigation = type => {
    console.log('Handle Navigation called');
    stopTracking();
    setCaliStatus(false);
    if (type === 'back') {
      navigation.goBack();
    }
  };

  // Function to update calibrations
  const updateCalibrations = (key, value) => {
    const newCons = {
      ...calibrations,
      [key]: value,
    };
    calibrations = newCons;
  };

  const startCalibration = () => {
    let calibrationConditionChck = 0;
    // First time let's check the lighting
    if (!lightsPassed) {
      if (!showingToast) {
        Toast.show({
          text1: ET_DEFAULTS.messages.ambientLightInfo,
          type: 'info',
          autoHide: false,
        });
        setShowingToast(true);
      }
      if (lastEyeTrackEvent) {
        const lightValidation = validateLighting(lastEyeTrackEvent.light);
        console.log('startCalibration =>lightValidation ==> ', lightValidation);
        if (
          (lightValidation && lightValidation.status === 'Moderate') ||
          lightValidation.status == 'Good'
        ) {
          console.log('startCalibration =>Light Validation Passed ==> ');
          setLightsPassed(true);
          Toast.hide();
          Toast.show({
            text1: lightValidation.message,
            type: 'success',
          });
        } else {
          Toast.hide();
          Toast.show({
            text1: lightValidation.message,
            type: 'error',
          });
          timeoutVar = setTimeout(() => {
            startCalibration();
          }, 1000);
        }
      } else {
        timeoutVar = setTimeout(() => {
          startCalibration();
        }, 500);
      }
      return;
    }

    const nextCalibrationPosition = nextCalibration();

    if (nextCalibrationPosition !== null) {
      // Let's move dot to next location
      lastPosition = nextCalibrationPosition;
      questionBlinkCountRef.current = 0;
      moveDot(nextCalibrationPosition);
      // Calculate Location X / Y of Eye Gaze
      updateCalibrations(nextCalibrationPosition, { left: 0, top: 0 });
      // console.log(calibrations);

      // Set Time Out then move to the next location
      timeoutVar = setTimeout(() => {
        startCalibration();
      }, parseInt(calibrationTime) || 2000);
    } else {
      // Done! Let's go!
      // Navigate to the next screen
      console.log('startCalibration =>All Calibrations Done');
      console.log('startCalibration =>TRACK_EYES => NO');
      TRACK_EYES = false;
      console.log(
        'startCalibration =>Final Calibrations are: ',
        CALIBRATED_POSITIONS,
      );
      const keys = Object.keys(calibrations);
      for (const key of keys) {
        if (
          CALIBRATED_POSITIONS[key] !== null &&
          positionArray[key] &&
          positionArray[key].left
        ) {
          const avgPos = calculateAveragePosition(
            CALIBRATED_POSITIONS[key].x,
            CALIBRATED_POSITIONS[key].y,
          );

          CALIBRATED_POSITIONS[key].avgX = avgPos.x;
          CALIBRATED_POSITIONS[key].avgY = avgPos.y;
          CALIBRATED_POSITIONS[key].dotX = positionArray[key].left;
          CALIBRATED_POSITIONS[key].dotY = positionArray[key].top;

          if (caliType === 'calibrationGaze') {
            const calibratedX = CALIBRATED_POSITIONS[key]?.avgX || 0; // Default to 0 if avgX is undefined
            const calibrationX = calibration[key]?.avgX || 0; // Default to 0 if avgX is undefined

            const calibratedY = CALIBRATED_POSITIONS[key]?.avgY || 0; // Default to 0 if avgY is undefined
            const calibrationY = calibration[key]?.avgY || 0; // Default to 0 if avgY is undefined

            // Check if calibratedX is within the range of calibrationX +/- 50
            const isWithinRangeX =
              calibratedX >= calibrationX - 50 &&
              calibratedX <= calibrationX + 50;

            // Check if calibratedX is within the range of calibrationX +/- 50
            const isWithinRangeY =
              calibratedY >= calibrationY - 50 &&
              calibratedY <= calibrationY + 50;

            if (!accuracy.hasOwnProperty(key)) {
              accuracy[key] = {}; // Initialize accuracy[key] object if not already initialized
            }

            accuracy[key].diffAvgX = Math.abs(calibratedX - calibrationX);
            accuracy[key].diffAvgY = Math.abs(calibratedY - calibrationY);

            if (isWithinRangeX && isWithinRangeY) {
              calibrationConditionChck = calibrationConditionChck + 1;
            }
          }
        }
      }

      // Let's add Begin Data to Object
      if (routeParams && routeParams.beginData) {
        CALIBRATED_POSITIONS.positionSnapshot = routeParams.beginData;
      }

      if (!CALIBRATED_POSITIONS.WIDTH) {
        CALIBRATED_POSITIONS.viewWidth = viewWidth;
        CALIBRATED_POSITIONS.viewHeight = viewHeight;
      }

      // Storing Calibrated Positions to Redux
      if (caliType === 'calibrateMap') {
        dispatch(setCalibration(CALIBRATED_POSITIONS));
      } else {
        dispatch(setCalibrationGaze(CALIBRATED_POSITIONS));
      }

      // Added to ReCalibrate for Gazing

      if (caliType === 'calibrationGaze') {
        handleUploadAssessmentData();
        if (calibrationConditionChck !== 5) {
          if (checkAttempt < 1) {
            dispatch(setCheckAttempt(checkAttempt + 1));
            if (caliType === 'calibrationGaze') {
              setCaliType('calibrateMap');
            }
            stopCalibration();

            setCaliStatus(false);
            setTimeout(() => {
              setCaliStatus(true);
            }, 1000);
            Toast.show({
              text1: 'Calibration failed! Please do it again.',
              // text2: 'Please restart to continue.',
              type: 'error',
            });
          } else {
            stopCalibration();
            setCaliStatus(false);
            navigation?.navigate('Symptoms', { event_id: 126 });

            Toast.show({
              text1: 'Calibration failed again!',
              // text2: 'Please restart to continue.',
              type: 'error',
            });
          }
        } else {
          navigation?.push('CallibrationSuccess');
        }
      } else {
        currentIndexEyeTracking1 = [];
        accuracy = {};
        Toast.show({
          text1: 'Please follow dot once again',
          // text2: 'Please restart to continue.',
          type: 'info',
        });
        setCaliType('calibrationGaze');
        stopCalibration();

        setCaliStatus(false);
        setTimeout(() => {
          setCaliStatus(true);
        }, 1000);
      }

      console.log(
        'startCalibration =>CALIBRATED_POSITIONS AVG',
        CALIBRATED_POSITIONS,
      );
    }
  };

  const stopCalibration = () => {
    if (timeoutVar) {
      clearTimeout(timeoutVar);
    }
    CALIBRATED_POSITIONS = {
      CENTER: { x: [], y: [] },
      TL: { x: [], y: [] },
      TR: { x: [], y: [] },
      BR: { x: [], y: [] },
      BL: { x: [], y: [] },
    };
    console.log('TRACK_EYES => NO');
    TRACK_EYES = false;
    calibrations = emptyCalibrations;
    // TODO: Fix setCalibration not working
    tXValue.value = -10;
    tYValue.value = -10;
  };

  const onLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    setViewWidth(width);
    setViewHeight(height);
  };

  const setTrackingTrue = () => {
    TRACK_EYES = true;
  };

  const moveDot = position => {
    // Set Position Array
    if (!positionArray[position]) {
      Toast.show({
        text1: 'Dot Positions are not set correctly.',
        type: 'error',
      });
      return;
    }
    // Moving Dot
    TRACK_EYES = false;
    tXValue.value = withTiming(
      positionArray[position].left,
      {
        duration: 300,
        easing: Easing.linear,
      },
      finished => {
        if (finished) {
          runOnJS(setTrackingTrue)();
        }
      },
    );

    tYValue.value = withTiming(positionArray[position].top, {
      duration: 300,
      easing: Easing.linear,
    });
  };

  const blueDotStyle = {
    width: ET_DEFAULTS.cali.caliBigDotSize,
    height: ET_DEFAULTS.cali.caliBigDotSize,
    borderRadius: ET_DEFAULTS.cali.caliBigDotSize / 2,
    backgroundColor: BaseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  };

  const blueDotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(animatedValue.value, [0, 0.5, 1], [1, 1.5, 1], {
            extrapolateRight: Extrapolation.CLAMP,
          }),
        },
        {
          translateX: tXValue.value,
        },
        {
          translateY: tYValue.value,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.main,
        {
          // backgroundColor: caliStatus ? BaseColors.borderColor : '#0005',
          backgroundColor: '#0001',
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        backgroundColor={'#0000'}
        barStyle="light-content"
        translucent={true}
      />
      <HeaderBar
        HeaderText={
          caliType === 'calibrateMap' ? 'Calibrate Map' : 'Calibrate Gaze'
        }
        isTransperant
        HeaderCenter
        // leftText="Cancel"
        leftBtnPress={() => {
          console.log('Back pressed');
          handleNavigation('back');
        }}
        LeftTextStyle={{ color: BaseColors?.white }}
        // rightText="Restart"
        rightBtnPress={() => {
          setCaliStatus(false);
          Toast.show({
            text1: 'Calibration will restart in 2 seconds!',
            type: 'success',
          });
          setTimeout(() => {
            setCaliStatus(true);
          }, 2000);
        }}
        rightTextStyle={{ color: BaseColors?.white }}
        HeaderTextStyle={{ color: BaseColors?.white }}
      />
      <View style={styles.dotContainer} onLayout={onLayout} ref={aoiRootView}>
        {caliStatus && !dynamicDot && (
          <Animated.View style={[blueDotStyle, blueDotAnimatedStyle]}>
            <Animatable.View
              style={styles.smallDotStyle}
              animation="customPulse"
              direction="alternate"
              easing="ease-in-out"
              iterationCount="infinite"
              duration={400}
            />
          </Animated.View>
        )}
        {dynamicDot &&
          positionArray.TL &&
          positionArray.TL.left &&
          viewHeight !== 0 &&
          viewWidth !== 0 && (
            <>
              <Animated.View
                style={[
                  blueDotStyle,
                  {
                    transform: [
                      { translateX: positionArray.TL.left },
                      { translateY: positionArray.TL.top },
                    ],
                  },
                ]}
              >
                <View style={styles.smallDotStyle} />
              </Animated.View>
              <Animated.View
                style={[
                  blueDotStyle,
                  {
                    transform: [
                      { translateX: positionArray.TR.left },
                      { translateY: positionArray.TR.top },
                    ],
                  },
                ]}
              >
                <View style={styles.smallDotStyle} />
              </Animated.View>
              <Animated.View
                style={[
                  blueDotStyle,
                  {
                    transform: [
                      { translateX: positionArray.CENTER.left },
                      { translateY: positionArray.CENTER.top },
                    ],
                  },
                ]}
              >
                <View style={styles.smallDotStyle} />
              </Animated.View>
              <Animated.View
                style={[
                  blueDotStyle,
                  {
                    transform: [
                      { translateX: positionArray.BL.left },
                      { translateY: positionArray.BL.top },
                    ],
                  },
                ]}
              >
                <View style={styles.smallDotStyle} />
              </Animated.View>
              <Animated.View
                style={[
                  blueDotStyle,
                  {
                    transform: [
                      { translateX: positionArray.BR.left },
                      { translateY: positionArray.BR.top },
                    ],
                  },
                ]}
              >
                <View style={styles.smallDotStyle} />
              </Animated.View>
            </>
          )}
      </View>
    </View>
  );
}
