/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  View,
  Text,
  Image,
  StatusBar,
  Platform,
  NativeEventEmitter,
  NativeModules,
  DeviceEventEmitter,
  Alert,
  AppState,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import styles from './styles';
import { Images } from '@config';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';
import Button from '@components/Button';
import {
  ET_DEFAULTS,
  init,
  remapEventObject,
  startEyePosTracking,
  stopEyePosTracking,
  stopTracking,
  validateLighting,
} from '@utils/eyeTracking';
import { EyeTracking } from '@components/EyeTracking';
import { useFocusEffect } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ScreenBrightness from 'react-native-screen-brightness';
import EyeTrackingRedux from '@redux/reducers/eyeTracking/actions';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSIONS, check, openSettings } from 'react-native-permissions';

const { Value } = Animated;
let lastEyeTrackEvent = null;

export default function Callibration({ navigation }) {
  const cameraInitialized = useSharedValue(0); // 0 = No, 1 = Yes
  const eyePosition = useSharedValue(0); // -1 = above, 0 = inline, 1 = below
  const [eyePosTrackingStatus, setEyePosTrackingStatus] = useState(false); // Instruction Text for user
  const [eyeTrackingStatus, setEyeTrackingStatus] = useState(true); // Instruction Text for user
  const [isValidPosition, setValidPosition] = useState(false); // Instruction Text for user
  const [Instruction, setInstruction] = useState(ET_DEFAULTS.cali.DEF_MSG); // Instruction Text for user
  const [whiteLineY, setWhiteLineY] = React.useState(null); // To store White Line Y
  const [validEventData, setValidEventData] = React.useState(null); // To store last event data
  const whiteLineRef = React.useRef(null);
  const [leftCirclePosition, setLeftCirclePosition] = React.useState(null);
  const [rightCirclePosition, setRightCirclePosition] = React.useState(null);
  const leftCircleRef = React.useRef(null);
  const rightCircleRef = React.useRef(null);

  const leftEyeX = useSharedValue(0); // Initial X position for left eye
  const leftEyeY = useSharedValue(0); // Initial Y position for left eye
  const rightEyeX = useSharedValue(0); // Initial X position for right eye
  const rightEyeY = useSharedValue(0); // Initial Y position for right eye
  const leftEyeAnimation = useSharedValue(0);
  const rightEyeAnimation = useSharedValue(0);

  const { setCheckAttempt, setCheckCameraPermission } = EyeTrackingRedux;
  const dispatch = useDispatch();
  const { cameraPermission, checkAttempt } = useSelector(state => {
    return state.eyeTracking;
  });

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // Use these values to animate eye circle border color
  const mainBGColor = useDerivedValue(() => {
    if (cameraInitialized.value === 0) {
      return BaseColors.black;
    }
    return BaseColors.transparent;
  });

  // Use these values to animate eye circle border color
  const borderColor = useDerivedValue(() => {
    if (eyePosition.value === 1) {
      return ET_DEFAULTS.cali.userEyeBorderValidColor;
    }
    return ET_DEFAULTS.cali.userEyeBorderInvalidColor;
  });

  const animatePulse = animationValue => {
    return useDerivedValue(() => {
      return (animationValue.value =
        Math.sin(new Date().getTime() * 0.005) * 0.5 + 0.5);
    });
  };
  const leftEyePulse = animatePulse(leftEyeAnimation);
  const rightEyePulse = animatePulse(rightEyeAnimation);

  // Function to open app settings
  const openAppSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.error('Error opening app settings:', error);
    }
  };

  const animatedLeftEyeStyle = useAnimatedStyle(() => {
    return {
      width: ET_DEFAULTS.cali.systemEyeCircleSize,
      height: ET_DEFAULTS.cali.systemEyeCircleSize,
      borderWidth: ET_DEFAULTS.cali.userEyeBorder,
      borderColor: borderColor.value,
      borderRadius: ET_DEFAULTS.cali.systemEyeCircleSize,
      transform: [
        {
          scale: 0.9 + leftEyePulse.value * 0.1,
        },
      ],
    };
  });

  const animatedRightEyeStyle = useAnimatedStyle(() => {
    return {
      width: ET_DEFAULTS.cali.systemEyeCircleSize,
      height: ET_DEFAULTS.cali.systemEyeCircleSize,
      borderWidth: ET_DEFAULTS.cali.userEyeBorder,
      borderColor: borderColor.value,
      borderRadius: ET_DEFAULTS.cali.systemEyeCircleSize,
      transform: [
        {
          scale: 0.9 + rightEyePulse.value * 0.1,
        },
      ],
    };
  });

  const leftEyeStyle = useAnimatedStyle(() => {
    return {
      width: ET_DEFAULTS.cali.userEyeSize,
      height: ET_DEFAULTS.cali.userEyeSize,
      borderRadius: ET_DEFAULTS.cali.userEyeSize / 2,
      borderWidth: ET_DEFAULTS.cali.userEyeBorder,
      borderColor: borderColor.value,
      position: 'absolute',
      top: leftEyeY.value,
      left: leftEyeX.value,
    };
  });

  const rightEyeStyle = useAnimatedStyle(() => {
    return {
      width: ET_DEFAULTS.cali.userEyeSize,
      height: ET_DEFAULTS.cali.userEyeSize,
      borderRadius: ET_DEFAULTS.cali.userEyeSize / 2,
      borderWidth: ET_DEFAULTS.cali.userEyeBorder,
      borderColor: borderColor.value,
      position: 'absolute',
      top: rightEyeY.value,
      left: rightEyeX.value,
    };
  });

  const mainBGStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: mainBGColor.value,
    };
  });

  const handleCircleLayout = event => {
    console.log('Handle Circle Layout Called ===>');
    const margin = ET_DEFAULTS.cali.userEyeSize / 2;
    leftCircleRef.current.measureInWindow((x, y, width, height) => {
      console.log(
        'setLeftCirclePosition Circle Layout Called ===>',
        x,
        y,
        width,
        height,
      );
      setLeftCirclePosition({ x: x + margin, y: y + margin, width, height });
    });
    rightCircleRef.current.measureInWindow((x, y, width, height) => {
      console.log(
        'rightCircleRef Circle Layout Called ===>',
        x,
        y,
        width,
        height,
      );
      setRightCirclePosition({ x: x + margin, y: y + margin, width, height });
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const trackListener = event => {
        const { leCenter, reCenter } = event;

        let isValid = false;

        // Assuming the Y value determines the position
        const avgEyeY = (leCenter.y + reCenter.y) / 2;
        const eyesDistance = Math.abs(reCenter.x - leCenter.x);

        leftEyeX.value = event.leCenter.x - ET_DEFAULTS.cali.userEyeSize / 2;
        leftEyeY.value = event.leCenter.y - ET_DEFAULTS.cali.userEyeSize / 2;
        rightEyeX.value = event.reCenter.x - ET_DEFAULTS.cali.userEyeSize / 2;
        rightEyeY.value = event.reCenter.y - ET_DEFAULTS.cali.userEyeSize / 2;

        // Pseudocode
        if (avgEyeY > whiteLineY + ET_DEFAULTS.cali.systemEyeCircleSize / 2) {
          setInstruction(ET_DEFAULTS.cali.validationMsg.head_up);
        } else if (
          avgEyeY <
          whiteLineY - ET_DEFAULTS.cali.systemEyeCircleSize / 2
        ) {
          setInstruction(ET_DEFAULTS.cali.validationMsg.head_down);
        }
        // Check if eyes are within the circle views
        else if (leftCirclePosition && rightCirclePosition) {
          const isLeftEyeInside =
            leCenter.x > leftCirclePosition.x &&
            leCenter.x <
              leftCirclePosition.x + ET_DEFAULTS.cali.systemEyeCircleSize / 2 &&
            leCenter.y > leftCirclePosition.y &&
            leCenter.y <
              leftCirclePosition.y + ET_DEFAULTS.cali.systemEyeCircleSize / 2;

          const isRightEyeInside =
            reCenter.x > rightCirclePosition.x &&
            reCenter.x <
              rightCirclePosition.x +
                ET_DEFAULTS.cali.systemEyeCircleSize / 2 &&
            reCenter.y > rightCirclePosition.y &&
            reCenter.y <
              rightCirclePosition.y + ET_DEFAULTS.cali.systemEyeCircleSize / 2;

          // Check distance between eyes and adjust user's position
          const circleDistance = Math.abs(
            rightCirclePosition.x - leftCirclePosition.x,
          );
          let distance_msg = '';
          let distance_valid = false;
          if (
            eyesDistance <
            circleDistance - ET_DEFAULTS.cali.systemEyeCircleSize
          ) {
            distance_msg = ET_DEFAULTS.cali.validationMsg.move_closer;
          } else if (
            eyesDistance >
            circleDistance + ET_DEFAULTS.cali.systemEyeCircleSize
          ) {
            distance_msg = ET_DEFAULTS.cali.validationMsg.move_away;
          } else {
            distance_valid = true;
            // distance_msg = 'Perfect! Stay still. ';
          }

          if (!isLeftEyeInside) {
            setInstruction(
              distance_msg + ET_DEFAULTS.cali.validationMsg.align_left,
            );
          } else if (!isRightEyeInside) {
            setInstruction(
              distance_msg + ET_DEFAULTS.cali.validationMsg.align_right,
            );
          } else {
            if (distance_valid) {
              isValid = true;
              setInstruction(ET_DEFAULTS.cali.validationMsg.success);
            }
          }
        }

        eyePosition.value = isValid ? 1 : 0;
        leftEyeAnimation.value = isValid ? 0 : 1;
        rightEyeAnimation.value = isValid ? 0 : 1;

        if (isValid !== isValidPosition) {
          setValidPosition(isValid);
        }
      };
      // Setup Emitter based on Device OS
      const emitter =
        Platform.OS === 'ios'
          ? new NativeEventEmitter(NativeModules.EyeTrackingEventEmitter)
          : DeviceEventEmitter;

      // Let's listen to Tracking Event
      const subscription = emitter.addListener(
        'tracking_eye_pos',
        trackListener,
      );

      const eyeTrackigListener = event => {
        if (lastEyeTrackEvent === null) {
          lastEyeTrackEvent = event;
          console.log('Last Eye Track Data: ===> Event', event);
          const lightValidation = validateLighting(lastEyeTrackEvent.light);
          if (
            (lightValidation && lightValidation.status === 'Moderate') ||
            lightValidation.status == 'Good'
          ) {
            const removeKeys = [
              'centerEyeLookAtPoint',
              'rightEyeLookAtPoint',
              'leftEyeLookAtPoint',
              'rightEyeBlink',
              'leftEyeBlink',
              'totalBlinks',
              'isBlink',
            ];
            const mappedEventData = remapEventObject(event);
            console.log('Mapped event data => ', mappedEventData);
            removeKeys.forEach(rKey => {
              delete mappedEventData[rKey];
            });

            setValidEventData(mappedEventData);
            Toast.hide();
            Toast.show({
              text1: lightValidation.message,
              type: 'success',
            });
            stopTracking();
            setTimeout(() => {
              setEyeTrackingStatus(false);
              cameraInitialized.value = 1;
            }, 500);
          } else {
            Toast.hide();
            Toast.show({
              text1: lightValidation.message,
              type: 'success',
            });
            setTimeout(() => {
              console.log('Last Eye Track Data: ===> Setting to Null');
              lastEyeTrackEvent = null;
            }, 1000);
          }
        }
        // console.log('eyeTrackingListener => ', event);
      };

      // Let's listen to Tracking Event
      const eyeTrackingSubscription = DeviceEventEmitter.addListener(
        'eyeTrackingEvent',
        eyeTrackigListener,
      );

      return () => {
        subscription.remove();
        eyeTrackingSubscription.remove();
        lastEyeTrackEvent = null;
      };
    }, [
      eyePosition,
      whiteLineY,
      leftEyeX,
      leftEyeY,
      rightEyeX,
      rightEyeY,
      leftCirclePosition,
      rightCirclePosition,
      leftEyeAnimation,
      rightEyeAnimation,
      isValidPosition,
      cameraInitialized,
    ]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkCameraPermission();
    }, []),
  );

  useEffect(() => {
    dispatch(setCheckAttempt(0));
    const focusInit = navigation.addListener('focus', () => {
      setEyePosTrackingStatus(false);
      setEyeTrackingStatus(true);
    });
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      ScreenBrightness.setBrightness(0.3);
    });

    return () => {
      focusInit();
      unsubscribe();
    };
  }, []);

  // Let's stop Native Eye Tracking when user navigates back
  React.useEffect(() => {
    const focusSubscribe = navigation.addListener('focus', () => {
      // Waiting 1 Second to complete Screen Transitioning Animation
      setTimeout(() => {
        console.log('On Cal Init Screen Init ===>');
        EyeTracking.showDebug(true);

        // Let's start Eye Tracking to find Ambient Lighting
        (cameraPermission === 'denied' || cameraPermission === 'granted') &&
          init();

        handleCircleLayout();
      }, 1000);
    });

    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (eyePosTrackingStatus) {
        stopEyePosTracking();
      }
      if (
        eyeTrackingStatus &&
        (cameraPermission === 'denied' || cameraPermission === 'granted')
      ) {
        stopTracking();
      }
      EyeTracking.showDebug(false);
    });
    return () => {
      focusSubscribe();
      unsubscribe();
    };
  }, [
    navigation,
    cameraInitialized,
    eyePosTrackingStatus,
    eyeTrackingStatus,
    cameraPermission,
  ]);

  // Let's check Ambient Lighting when user comes to the screen
  React.useEffect(() => {
    if (eyeTrackingStatus === false && eyePosTrackingStatus === false) {
      setEyePosTrackingStatus(true);
      startEyePosTracking();
    }
  }, [eyeTrackingStatus, eyePosTrackingStatus]);

  useEffect(() => {
    cameraPermission === 'blocked' &&
      appStateVisible === 'active' &&
      Alert.alert(
        'Camera Permission',
        'Your Provider uses your data from your front facing camera to assess and manage your recovery. Please exit this application and allow front camera access via your device settings.',
        [
          {
            text: 'Cancel',
            onPress: () => {
              dispatch(setCheckAttempt(checkAttempt + 1));
              navigation?.navigate('Symptoms', { event_id: 126 });
            },
            style: 'cancel',
          },
          { text: 'Settings', onPress: () => openAppSettings() },
        ],
      );
  }, [cameraPermission, appStateVisible]);

  const checkCameraPermission = async () => {
    let permission;
    // Check the correct permission based on the platform
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    // Check the permission status
    const result = await check(permission);
    dispatch(setCheckCameraPermission(result));
  };

  return (
    <Animated.View style={[styles.main, mainBGStyle]}>
      <StatusBar
        backgroundColor={'#0000'}
        barStyle="light-content"
        translucent={true}
      />
      {/* <Image source={Images?.callibrateImg} style={styles.imgStyle} /> */}

      <HeaderBar
        HeaderText={'Camera Setup'}
        isTransperant
        HeaderCenter
        leftText="Cancel"
        leftBtnPress={() => {
          navigation.goBack();
          dispatch(setCheckAttempt(0));
        }}
        LeftTextStyle={{ color: BaseColors?.white }}
        HeaderTextStyle={{ color: BaseColors?.white }}
      />

      <View
        style={[
          styles.main,
          {
            alignItems: 'center',
            justifyContent: 'space-around',
          },
        ]}
      >
        <View
          style={{
            top: 0,
            bottom: 0,
            marginHorizontal: 10,
            width: '100%',
            height: '90%',
            alignItems: 'center',
            justifyContent: 'space-around',
            position: 'absolute',
            opacity: eyeTrackingStatus ? 0 : 1,
          }}
        >
          <Image
            source={Images?.faceposition}
            resizeMode="contain"
            style={styles.imgStylee}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={[
              styles?.squareBorder,
              { opacity: eyeTrackingStatus ? 0 : 1 },
            ]}
          >
            {/* White line to let user know where he needs to align their eyes */}
            <View
              ref={whiteLineRef}
              onLayout={() => {
                whiteLineRef.current.measureInWindow((x, y, width, height) => {
                  setWhiteLineY(y);
                });
              }}
              style={{
                width: '100%',
                height: 2,
                backgroundColor: BaseColors.white,
                position: 'relative',
                top: ET_DEFAULTS.cali.systemEyeCircleSize / 2 - 1,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                width: ET_DEFAULTS.cali.eyesDistance,
                justifyContent: 'space-between',
              }}
            >
              {/* Left Eye Circle */}
              <View>
                <Animated.View
                  ref={leftCircleRef}
                  style={animatedLeftEyeStyle}
                />
                <Image
                  resizeMode="contain"
                  style={{
                    position: 'absolute',
                    right: ET_DEFAULTS.cali.systemEyeCircleSize / 2 - 4,
                    top: ET_DEFAULTS.cali.systemEyeCircleSize / 2 - 4,
                  }}
                  source={Images?.arrowr}
                />
              </View>
              {/* Right Eye Circle */}
              <View>
                <Animated.View
                  ref={rightCircleRef}
                  style={animatedRightEyeStyle}
                />
                <Image
                  resizeMode="contain"
                  style={{
                    position: 'absolute',
                    left: ET_DEFAULTS.cali.systemEyeCircleSize / 2 - 3,
                    top: ET_DEFAULTS.cali.systemEyeCircleSize / 2 - 3,
                  }}
                  source={Images?.arrowleft}
                />
              </View>
            </View>
          </View>
          <View style={{ width: '50%', flex: 0.5, justifyContent: 'flex-end' }}>
            <Text style={styles?.bigtext}>
              {eyeTrackingStatus
                ? 'Analyzing Ambient Lighting Conditions'
                : Instruction}
            </Text>
          </View>
        </View>
        <Button
          shape="round"
          onPress={() => {
            if (isValidPosition) {
              stopEyePosTracking();
              navigation?.navigate('CallibrationStart', {
                beginData: validEventData,
              });
            }
          }}
          title={'Begin Camera Setup'}
          style={[styles.requestBtn, { opacity: eyeTrackingStatus ? 0 : 1 }]}
          disabled={!isValidPosition}
        />
      </View>
      {/* Left and Right Eye Animated Views */}
      <Animated.View style={leftEyeStyle} />
      <Animated.View style={rightEyeStyle} />
    </Animated.View>
  );
}
