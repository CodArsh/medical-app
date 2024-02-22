/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@components/Button';
import HeaderBar from '@components/HeaderBar';
import { BaseColors, FontFamily } from '@config/theme';
import { Slider } from '@miblanchard/react-native-slider';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  NativeEventEmitter,
  NativeModules,
  DeviceEventEmitter,
  Dimensions,
  BackHandler,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import { captureScreen } from 'react-native-view-shot';
import styles from './styles';
import { useNavigationState } from '@react-navigation/native';
import {
  calculateScreenX,
  calculateScreenY,
  init,
  remapEventObject,
  sortObjectByKeysOrder,
} from '@utils/eyeTracking';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import axios from 'axios';
import { getDate } from '@utils/CommonFunction';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import LabeledInput from '@components/LabeledInput';
import { isEmpty, isUndefined } from 'lodash';
import MainLoader from '@components/MainLoader';

let MOVE_DOT = true;
let currentIndexEyeTracking = {};
let currentIndexEyeTracking1 = [];
let currentIndexStartTime = null;
let currentIndexEndTime = null;

const baseUrl = __DEV__
  ? 'http://192.168.2.152:4000'
  : 'https://eyetracking-api.oculabs.com';

const Symptoms = ({ navigation, route }) => {
  const navigationState = useNavigationState(state => state);
  const data = route?.params?.otherData;
  const { darkmode } = useSelector(state => state.auth);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const eventId = data?.event_id;

  const [activeButtonIndex, _setActiveButtonIndex] = useState(0);
  const myAIRef = React.useRef(activeButtonIndex);
  const setActiveButtonIndex = data => {
    myAIRef.current = data;
    _setActiveButtonIndex(data);
  };

  const [sliderValue, setSliderValue] = useState(1);

  /* AOI Code */
  const { calibration, calibration_gaze, checkAttempt } = useSelector(state => {
    return state.eyeTracking;
  });
  const [dynamicDot, setDynamicDot] = useState(false);
  const tXValue = useSharedValue(-10);
  const tYValue = useSharedValue(-10);
  const [aoiXY, setAOIXY] = useState([]);
  const aoiRootView = useRef(null);
  const aoiRef = useRef(null);
  const aoiAnalytics = useState([]);
  const eyeTrackingPoints = useState([]);
  const [deviceName, setDeviceName] = useState(null);
  const [bgImageURI, setBgImageURI] = useState(null);
  const [tag, _setTag] = useState([]);
  const myTageRef = React.useRef(tag);
  const setTag = data => {
    myTageRef.current = data;
    _setTag(data);
  };
  const [symptomArray, setSymptomArray] = useState([]);
  const [takeBoolean, setTakeBoolean] = useState(false);
  const flatListRef = useRef(null);
  const [meta, setMeta] = useState([]);
  const [patient_question, set_patient_question] = useState([]);
  const [boolQuestion, setBoolQuestion] = useState([]);
  const [inputQuestion, setInputQuestion] = useState([]);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [text, setText] = useState('');
  const [textErrObj, setTextErrObj] = useState({ error: false, msg: '' });
  const [validBool, setValidBool] = useState(true);
  const [physical, setPhysical] = useState(0);
  const [mental, setMental] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [head, setHead] = useState([]);
  const [pressureHead, setPressureHead] = useState([]);
  const [neckPain, setNeckPain] = useState([]);
  const [nauSea, setNausea] = useState([]);
  const [dizz, setDizz] = useState([]);
  const [blurred, setBlurred] = useState([]);
  const [balance, setBalance] = useState([]);
  const [sensitiveLight, setSensitiveLight] = useState([]);
  const [sensitiveNoise, setSensitiveNoise] = useState([]);
  const [feelingSlowed, setFeelingSlowed] = useState([]);
  const [feelingLike, setFeelingLike] = useState([]);
  const [feelRight, setFeelRight] = useState([]);
  const [difficultyCon, setDifficultyCon] = useState([]);
  const [difficultyRem, setDifficultyRem] = useState([]);
  const [low, setLow] = useState([]);
  const [confusion, setConfusion] = useState([]);
  const [draw, setDraw] = useState([]);
  const [emotional, setEmotional] = useState([]);
  const [irritable, setIrritable] = useState([]);
  const [sad, setSad] = useState([]);
  const [nervous, setNervous] = useState([]);
  const [trouble, setTrouble] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState(0);
  const [validPhysical, setValidPhysical] = useState(false);
  const [vaildMental, setValidMental] = useState(false);
  const [timer, setTimer] = useState([0, 0, 0]);
  const [btnLoad, setBtnLoad] = useState(false);

  // slider details state management
  const [count, setCount] = useState(0);
  const [duration, setDuration] = useState(0);
  // console.log('🚀 ~ file: index.js:693 ~ Symptoms ~ duration:', duration);

  const [initValue, setInitValue] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [lastValue, setLastValue] = useState(0);
  const [smallestVal, setSmallestVal] = useState();

  const [prevTag, setPrevTag] = useState([]);
  const [revisit, setRevisit] = useState(0);

  const subscriptionRef = useRef(null);
  const eventBlinkCountRef = useRef(0);
  const questionBlinkCountRef = useRef(0);

  const stateArray = [
    head,
    pressureHead,
    neckPain,
    nauSea,
    dizz,
    blurred,
    balance,
    sensitiveLight,
    sensitiveNoise,
    feelingSlowed,
    feelingLike,
    feelRight,
    difficultyCon,
    difficultyRem,
    low,
    confusion,
    draw,
    emotional,
    irritable,
    sad,
    nervous,
    trouble,
  ];
  /*
    TODO: 1 - Calculate and Push the Analytics
fix_aoi	      = Total # of fixations b/w 200-500ms duration within AOI
Question: What if user looks at AOI for 5 Seconds? Will it consider 10 Fixation of 500ms? or 0 Fixation?
Currenly it's considering only if Fixation is b/w 200-500ms


viewed	      = fix_aoi > = 2
fix_dur_aoi	    = Average total fixation duration within AOI
fix_screen	    = Total # of fixations @ 150 to 300 msec duration on screen
total_fix_dur	  = Sum fix_dur_screen
fix_dur_screen	= t	Average fixation duration on screen


    DONE: 2 - Heatmap generation: In React JS
    DONE: 3 - Generating Sequence
    DONE: 4 - Playing Recording
            - Done: But just had delay in Replaying



    NEW TODO on 31st JULY
    TODO: 1 - Reduce the size of Calibration data. Try with 10 Seconds, 30 Seconds, 1 Minutes, 2 Minutes, 3 Minutes
    TODO: 2 - How are we rendering the correct sized static mobile screen?
    TODO: 3 - Documentation of Eye Tracking
  */

  const { userData } = useSelector(state => {
    return state.auth;
  });

  DeviceInfo.getDeviceName().then(dName => {
    setDeviceName(dName);
  });

  useEffect(() => {
    // display the questions list
    const QuestionListAPI = async () => {
      const endPoint = `${BaseSetting.endpoints.questionList}?event_type=5&list=a&event_id=${userData?.id}`;
      try {
        const res = await getApiData(`${endPoint}`, 'GET');

        if (res?.status) {
          const questionsArray = [];
          const metaName = [];
          const p_question = [];
          const boolQue = [];
          const inputQue = [];
          const prevTagArray = [];
          for (let i = 0; i < res?.data.length; i++) {
            if (res?.data[i]?.type === '4') {
              // scale list
              questionsArray.push(res?.data[i]?.question);
              prevTagArray.push(res?.data[i]?.prev_key);
              metaName.push(res?.data[i]?.meta_name.toLowerCase());
              p_question.push(res?.data[i]?.patient_question);
            }
            if (res?.data[i].type === '5') {
              // boolean questions stored
              boolQue.push(res?.data[i]?.question);
            }
            if (res?.data[i].type === '7') {
              // input questions stored
              inputQue.push(res?.data[i]?.question);
            }
          }
          setPrevTag(prevTagArray);
          console.log('Adding Event Data: Set Tags:', questionsArray);
          setTag(questionsArray);
          setMeta(metaName);
          set_patient_question(p_question);
          setBoolQuestion(boolQue);
          setInputQuestion(inputQue);
          setLoading(false);
        }
      } catch (error) {
        console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
      }
    };

    QuestionListAPI();
  }, [eventId]);

  // Uploading Assessment Data to Server
  const handleUploadAssessmentData = async () => {
    console.log('Handle Assessment: Uploading');
    try {
      const apiUrl = `${baseUrl}/store-assessment`; // Replace with your API endpoint

      // Sample data to be uploaded (modify as needed)
      const formData = new FormData();
      formData.append('deviceBackgroundImage', {
        uri: bgImageURI,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formData.append('assessmentId', Math.random().toString(36).substr(2, 10));
      formData.append(
        'userName',
        `${userData?.firstname} ${userData?.lastname}`,
      );
      formData.append('deviceModel', DeviceInfo.getModel());
      formData.append('deviceName', deviceName);
      formData.append('deviceSize', JSON.stringify(Dimensions.get('window')));

      console.log('Handle Assessment: Building new object');

      formData.append(
        'aoiJson',
        JSON.stringify({
          calibratePosition: calibration.positionSnapshot,
          calibrateMap: calibration,
          calibrateGaze: calibration_gaze,
          eyeDataByScreen: currentIndexEyeTracking,
          aoiXY,
          eyeData: currentIndexEyeTracking1,
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

      // Once the Upload is done, Let's take SS of new Step
      await captureSS();

      // Handle the response from the server
      console.log('Handle Assessment: Response from server:', response.data);
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Handle Assessment: Error uploading data:', error);
    }
  };

  const updateStateDynamically = (state, sliderObject) => {
    const existingIndex = state.findIndex(
      item => item.symptom === sliderObject.symptom,
    );

    if (existingIndex !== -1) {
      state[existingIndex] = {
        ...state[existingIndex],
        score_chng: state[existingIndex].score_chng + sliderObject.score_chng,
        dur_screen: state[existingIndex].dur_screen + sliderObject.dur_screen,
        page_revisit_int:
          state[existingIndex].page_revisit_int + sliderObject.page_revisit_int,
        final_score: sliderObject.final_score,
      };
    } else {
      state.push(sliderObject);
    }

    return [...state];
  };

  const stateUpdater = (state, updatedState) => {
    if (state === head) {
      setHead(updatedState);
    } else if (state === pressureHead) {
      setPressureHead(updatedState);
    } else if (state === neckPain) {
      setNeckPain(updatedState);
    } else if (state === nauSea) {
      setNausea(updatedState);
    } else if (state === dizz) {
      setDizz(updatedState);
    } else if (state === blurred) {
      setBlurred(updatedState);
    } else if (state === balance) {
      setBalance(updatedState);
    } else if (state === sensitiveLight) {
      setSensitiveLight(updatedState);
    } else if (state === sensitiveNoise) {
      setSensitiveNoise(updatedState);
    } else if (state === feelingSlowed) {
      setFeelingSlowed(updatedState);
    } else if (state === feelingLike) {
      setFeelingLike(updatedState);
    } else if (state === feelRight) {
      setFeelRight(updatedState);
    } else if (state === difficultyCon) {
      setDifficultyCon(updatedState);
    } else if (state === difficultyRem) {
      setDifficultyRem(updatedState);
    } else if (state === low) {
      setLow(updatedState);
    } else if (state === confusion) {
      setConfusion(updatedState);
    } else if (state === draw) {
      setDraw(updatedState);
    } else if (state === emotional) {
      setEmotional(updatedState);
    } else if (state === irritable) {
      setIrritable(updatedState);
    } else if (state === sad) {
      setSad(updatedState);
    } else if (state === nervous) {
      setNervous(updatedState);
    } else if (state === trouble) {
      setTrouble(updatedState);
    }
  };

  useEffect(() => {
    const startTime = new Date().getTime(); // Get the current timestamp when the useEffect starts.

    const intervalIds = setInterval(() => {
      const currentTime = new Date().getTime(); // Get the current timestamp.
      const elapsedMilliseconds = currentTime - startTime; // Calculate the elapsed time in milliseconds.
      setDuration(elapsedMilliseconds); // Update the duration with the elapsed time.
    }, 1000);

    return () => {
      clearInterval(intervalIds);
    };
  }, [activeButtonIndex]);

  // this function for handle symptoms while change from tabs
  function symptomsChange(index) {
    setCount(0);
    setRevisit(0);
    setDuration(0);
    setActiveButtonIndex(index);
    const nData = symptomArray[index];
    if (nData) {
      setSliderValue([nData?.final_score + 2]); // this value set for slider
    }
  }

  // Handle On Symptom Change
  const handleSymptomChange = index => {
    const updatedSymptomArray = [...symptomArray];

    if (
      ((isEmpty(updatedSymptomArray[index - 1]) ||
        isUndefined(updatedSymptomArray[index - 1])) &&
        !count &&
        index > activeButtonIndex) ||
      smallestVal === 1
    ) {
      Toast.show({
        text1: 'Please select any range.',
        type: 'error',
      });
    } else {
      let sliderObject = {};
      if (updatedSymptomArray[index - 1]?.symptom === meta[index - 1]) {
        // this logic for manage data if user again come to a particular tab
        const obj = { ...updatedSymptomArray[index - 1] };
        const [extractFinal] = sliderValue;
        sliderObject = { ...updatedSymptomArray[index] };
        sliderObject.dur_screen = obj?.dur_screen + duration;
        sliderObject.final_score = extractFinal - 2;
        sliderObject.initial_score = obj?.initial_score;
        sliderObject.page_revisit_int = obj.page_revisit_int + 1;
        sliderObject.score_chng = obj.score_chng + count;
        sliderObject.symptom = meta[index - 1];
        setActiveButtonIndex(index);
        const nData = symptomArray[index];

        if (nData) {
          setSliderValue([nData?.final_score + 2]); // this value set for slider
        }
        const filteredArray = trouble.filter(
          item => item.symptom !== undefined,
        );
        setSymptomArray(filteredArray);
      } else {
        sliderObject = {
          fix_aoi: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
          viewed:
            Number(Math.floor(Math.random() * (10 - 0)) + 0) >
            Number(Math.floor(Math.random() * (5 - 1)) + 1)
              ? true
              : false,
          fix_dur_aoi: parseFloat(
            (Math.random() * (1000.0 - 0.0) + 0.0).toFixed(2),
          ),
          fix_screen: Number(Math.floor(Math.random() * (20 - 0)) + 0),
          total_fix_dur: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
          fix_dur_screen: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
          symptom: meta[index - 1],
          initial_score: initValue,
          score_chng: count,
          final_score: lastValue,
          dur_screen: duration,
          page_revisit_int: revisit,
        };
        const filteredArray = trouble.filter(
          item => item.symptom !== undefined,
        );
        setSymptomArray(filteredArray);
      }

      stateArray.forEach(state => {
        const updatedState = updateStateDynamically(state, sliderObject);
        stateUpdater(state, updatedState);
      });

      if (updatedSymptomArray[index - 1]) {
        updatedSymptomArray[index - 1] = {
          ...updatedSymptomArray[index - 1],
          ...sliderObject,
        };
      } else {
        updatedSymptomArray.push(sliderObject);
      }
      console.log('Updated data : ', sliderObject);
      setSymptomArray(updatedSymptomArray);
      if (tag[index]) {
        currentIndexEndTime = getDate();

        if (Platform.OS === 'ios') {
          // Upload the Assessment Data to Server
          checkAttempt < 1 &&
            !isEmpty(calibration) &&
            handleUploadAssessmentData();
        }
        // currentIndexEyeTracking = {};
        setActiveButtonIndex(index);
        flatListRef?.current?.scrollToIndex({ index, animated: true });
      } else {
        setTakeBoolean(true);
      }
      if (updatedSymptomArray[index]) {
      } else {
        setDuration(0);
        ResetValues();
      }
    }
  };

  const SubmitSymptom = () => {
    let valid = true;
    if (isEmpty(text)) {
      valid = false;
      setTextErrObj({
        error: true,
        msg: 'Please enter percentage',
      });
    } else {
      const percentages = parseFloat(text);
      if (percentages > 100) {
        valid = false;
        setTextErrObj({
          error: true,
          msg: 'Percentage cannot be more than 100%',
        });
      }
    }

    if (activeIndexes.length === checkValid) {
      setValidBool(true);
    } else {
      console.log('required =>', activeIndexes.length);
    }
    console.log(valid, validBool);
    if (valid && validBool) {
      createSymptom();
    } else {
      Toast.show({
        text1: 'Please fill all informations.',
        type: 'error',
      });
    }
  };
  // api integration for create call
  const createSymptom = async () => {
    setBtnLoad(true);
    const updatedSymptomArray = symptomArray.concat(lastThreeSymptoms);
    try {
      const response = await getApiData(
        BaseSetting.endpoints.symptom,
        'POST',
        {
          event_id: eventId,
          answers: JSON.stringify(updatedSymptomArray),
          created_from: 'app',
        },
        '',
        false,
      );
      if (response?.status) {
        data.immediate_recall === 0
          ? navigation.navigate('ImmediateRecall', {
              event_id: eventId,
              otherData: data,
            })
          : data.digit_recall === 0
          ? navigation.navigate('Recalldigits', {
              event_id: eventId,
              otherData: data,
            })
          : navigation.navigate('Comment', {
              event_id: eventId,
              otherData: data,
            });
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
      } else {
        Toast.show({
          text1: response?.message.toString(),
          type: 'error',
        });
      }
      setBtnLoad(false);
    } catch (error) {
      console.log('error =======>>>', error);
      Toast.show({
        text1: error.toString(),
        type: 'error',
      });
      setBtnLoad(false);
    }
  };

  const ResetValues = () => {
    setCount(0);
    setInitValue(0);
    setMilliseconds(0);
    setLastValue(0);
    setSliderValue(1);
  };

  useEffect(() => {
    if (bgImageURI && !dynamicDot) {
      setDynamicDot(true);
    }
  }, [bgImageURI, dynamicDot]);

  const captureSS = () => {
    return new Promise((resolve, reject) => {
      console.log('Sym Called ===> Capture SS');
      captureScreen({
        format: 'jpg',
        quality: 0.7,
      }).then(
        uri => {
          console.log('Sym Called ===> Capture SS Done');
          // console.log('AOI XY Updated Image saved to', uri);
          setBgImageURI(uri);
          resolve(true);
        },
        error => {
          console.error('AOI XY Updated Image Oops, snapshot failed', error);
          resolve(false);
        },
      );
    });
  };

  // Let's call functions one by one
  useEffect(() => {
    questionBlinkCountRef.current = 0;
    const getViewMeasurements = async () => {
      return new Promise((resolve, reject) => {
        console.log('Sym Called ===> AOI XY Updated Component => ', aoiRef);
        if (aoiRef.current) {
          aoiRootView.current.measure(
            (rx, ry, rwidth, rheight, rpageX, rpageY) => {
              aoiRef.current.measure((x, y, width, height, pageX, pageY) => {
                console.log('Sym Called ===> XY Found');
                setAOIXY([
                  ...aoiXY,
                  {
                    index: activeButtonIndex,
                    x: {
                      rootStart: pageX - rpageX,
                      rootEnd: pageX - rpageX + width,
                      start: pageX,
                      end: pageX + width,
                      width: width,
                    },
                    y: {
                      rootStart: pageY - rpageY,
                      rootEnd: pageY - rpageY + height,
                      start: pageY,
                      end: pageY + height,
                      height: height,
                    },
                    screen: Dimensions.get('window'),
                    rootY: rpageY,
                  },
                ]);
                resolve(true);
              });
            },
          );
        } else {
          console.log('Sym Called ===> View Ref not found');
        }
      });
    };

    const handleAOILayout = async () => {
      console.log('Sym Called ===> Start');
      await captureSS();

      console.log('Sym Called ===> Start 1');
      // Let's Init Eye Tracking
      await init();
      console.log('Sym Called ===> Start 2');
      await getViewMeasurements();
      console.log('Sym Called ===> Start 3');

      console.log('Calibration in Redux => ', calibration);

      // Let's listen to Tracking Event
      subscriptionRef.current = DeviceEventEmitter.addListener(
        'eyeTrackingEvent',
        event => {
          console.log('Sym Called ==> Event Received');

          // ADDED For TESTING PURPOSE: Let's move the dot using Eye Gaze.
          if (MOVE_DOT) {
            const newXValue = calculateScreenX(
              event.centerEyeLookAtPoint.x,
              calibration,
              calibration.viewWidth,
            );
            const newYValue = calculateScreenY(
              event.centerEyeLookAtPoint.y,
              calibration,
              calibration.viewHeight,
            );

            // Let's move a fake red circle to test if Eye Tracking works or not
            if (!isNaN(newXValue) && !isNaN(newYValue)) {
              tXValue.value = newXValue;
              tYValue.value = newYValue;
              if (currentIndexStartTime == null) {
                currentIndexStartTime = getDate();
              }

              const aiIndex = myAIRef.current;

              if (!currentIndexEyeTracking[myTageRef.current[aiIndex]]) {
                currentIndexEyeTracking[myTageRef.current[aiIndex]] = {
                  positionSnapshot: {},
                  eyeData: { eyeDataOverTime: [] },
                  totalBlinks: 0,
                };
                currentIndexEyeTracking1 = [];
              }

              // Remap Object as asked by Kyle 18 Oct
              let eventObject = remapEventObject(event);

              if (
                isEmpty(
                  currentIndexEyeTracking[myTageRef.current[aiIndex]]
                    ?.positionSnapshot,
                )
              ) {
                currentIndexEyeTracking[
                  myTageRef.current[aiIndex]
                ].positionSnapshot = remapEventObject(event);
              }

              // Let's push Event Data for the spcific screen
              currentIndexEyeTracking[
                myTageRef.current[aiIndex]
              ].eyeData.eyeDataOverTime.push({
                // ...event,
                eventData: eventObject,
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

              // Let's update total blinks
              currentIndexEyeTracking[myTageRef.current[aiIndex]].totalBlinks =
                questionBlinkCountRef?.current;
            }

            if (eventBlinkCountRef?.current !== event.totalBlinks) {
              questionBlinkCountRef.current = questionBlinkCountRef.current + 1;
              eventBlinkCountRef.current = event.totalBlinks;
            }
          }
        },
      );
      MOVE_DOT = true;
    };

    const focusSubscribe = navigation.addListener('focus', () => {
      // Waiting 1 Second to complete Screen Transitioning Animation
      setTimeout(() => {
        checkAttempt < 1 && !isEmpty(calibration) && handleAOILayout();
      }, 1000);
    });

    // Let's clear all the data before going back
    const brSubscribe = navigation.addListener('beforeRemove', e => {
      subscriptionRef?.current?.remove();
      MOVE_DOT = false;
      currentIndexEyeTracking = {};
      currentIndexEyeTracking1 = [];
      currentIndexStartTime = null;
      currentIndexEndTime = null;
    });

    return () => {
      focusSubscribe();
      brSubscribe();
    };
  }, [myAIRef.current]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMilliseconds(prevMilliseconds => prevMilliseconds + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // On Slider Change Value
  const handleValueChange = newValue => {
    const [extractedValue] = newValue;
    setSmallestVal(extractedValue);
    setSliderValue(newValue);
    setLastValue(newValue - 2);
  };

  useEffect(() => {
    if (count === 1) {
      setInitValue(sliderValue - 2);
    }
  }, [count]);

  useEffect(() => {
    setTextErrObj({ error: false, msg: '' });
  }, []);

  let checkValid = boolQuestion.length;

  const handleButtonPress = (item, bool, rowIndex, buttonIndex) => {
    console.log(rowIndex, buttonIndex);
    if (rowIndex === 0) {
      setPhysical(!buttonIndex);
      setValidPhysical(true);
    } else if (rowIndex === 1) {
      setValidMental(true);
      setMental(!buttonIndex);
    }
    const newActiveIndexes = [...activeIndexes];
    newActiveIndexes[rowIndex] = buttonIndex;
    setActiveIndexes(newActiveIndexes);
  };

  const checkNext = () => {
    if (validPhysical) {
      setDuration(1);
      setNext(next + 1);
      setValidPhysical(false);
    } else if (vaildMental) {
      setDuration(1);
      setNext(next + 1);
    } else {
      Toast.show({
        text1: 'Select your answer',
        type: 'error',
      });
    }
  };

  // count timing for last three symptoms
  useEffect(() => {
    let interval;
    if (takeBoolean && next >= 0 && next <= 2) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          const updatedTimer = [...prevTimer];
          updatedTimer[next]++;
          return updatedTimer;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [next, takeBoolean]);

  const lastThreeSymptoms = [
    {
      fix_aoi: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      viewed:
        Number(Math.floor(Math.random() * (10 - 0)) + 0) >
        Number(Math.floor(Math.random() * (5 - 1)) + 1)
          ? true
          : false,
      fix_dur_aoi: parseFloat(
        (Math.random() * (1000.0 - 0.0) + 0.0).toFixed(2),
      ),
      fix_screen: Number(Math.floor(Math.random() * (20 - 0)) + 0),
      total_fix_dur: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      fix_dur_screen: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      symptom: 'physical_activity',
      initial_score: false,
      score_chng: 0,
      final_score: physical,
      dur_screen: timer[0],
      page_revisit_int: 1,
    },
    {
      fix_aoi: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      viewed:
        Number(Math.floor(Math.random() * (10 - 0)) + 0) >
        Number(Math.floor(Math.random() * (5 - 1)) + 1)
          ? true
          : false,
      fix_dur_aoi: parseFloat(
        (Math.random() * (1000.0 - 0.0) + 0.0).toFixed(2),
      ),
      fix_screen: Number(Math.floor(Math.random() * (20 - 0)) + 0),
      total_fix_dur: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      fix_dur_screen: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      symptom: 'mental_activity',
      initial_score: false,
      score_chng: 0,
      final_score: mental,
      dur_screen: timer[1],
      page_revisit_int: 1,
    },
    {
      fix_aoi: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      viewed:
        Number(Math.floor(Math.random() * (10 - 0)) + 0) >
        Number(Math.floor(Math.random() * (5 - 1)) + 1)
          ? true
          : false,
      fix_dur_aoi: parseFloat(
        (Math.random() * (1000.0 - 0.0) + 0.0).toFixed(2),
      ),
      fix_screen: Number(Math.floor(Math.random() * (20 - 0)) + 0),
      total_fix_dur: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      fix_dur_screen: Number(Math.floor(Math.random() * (1000 - 0)) + 0),
      symptom: 'feel_perfect',
      initial_score: 1,
      score_chng: 3,
      final_score: percentage,
      dur_screen: timer[2],
      page_revisit_int: 1,
    },
  ];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    setShowConfirmation(true);
    return true;
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <HeaderBar
        HeaderText={'Symptoms'}
        HeaderCenter
        leftText="Cancel"
        leftBtnPress={() => {
          if (checkAttempt < 1) {
            navigation.goBack();
            if (navigationState?.routes?.length === 5) {
              navigation.goBack();
            }
          } else {
            navigation.popToTop();
          }
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollcontainer,
          {
            backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ref={aoiRootView}
      >
        <>
          {loading ? (
            <View style={styles.loadingIndicator}>
              <MainLoader />
            </View>
          ) : (
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'space-between',
              }}
            >
              {!takeBoolean ? (
                <View>
                  <FlatList
                    data={tag}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                      <View
                        style={[
                          styles.buttoncontainer,
                          { opacity: index > activeButtonIndex ? 0.5 : 1 },
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            index > activeButtonIndex
                              ? null
                              : symptomsChange(index)
                          }
                          style={[
                            {
                              backgroundColor:
                                activeButtonIndex === index
                                  ? BaseColors.secondary
                                  : BaseColors.inactive,
                            },
                            styles.yesbutton,
                            {
                              width: Number(150),
                            },
                          ]}
                          activeOpacity={
                            index > activeButtonIndex
                              ? 1
                              : BaseSetting.buttonOpacity
                          }
                        >
                          <Text
                            style={[
                              {
                                color:
                                  activeButtonIndex === index
                                    ? BaseColors.white
                                    : BaseColors.textColor,
                              },
                              styles.btnText,
                            ]}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={item => item.id}
                    ref={flatListRef}
                  />
                  <Text
                    style={[
                      styles.yesText,

                      {
                        color: darkmode ? BaseColors.white : BaseColors.black90,
                      },
                    ]}
                  >
                    Please select the severity level you can also see the
                    previous severity level.
                  </Text>
                  {tag?.map((item, index) => {
                    return (
                      index === activeButtonIndex && (
                        <>
                          <View
                            // onLayout={handleAOILayout}
                            ref={aoiRef}
                          >
                            <Text
                              style={[
                                styles.boldText,
                                {
                                  color: darkmode
                                    ? BaseColors.white
                                    : BaseColors.textColor,
                                },
                              ]}
                            >
                              Please report the severity level of:{' '}
                            </Text>
                            <Text
                              style={[
                                styles.boldTextsymptom,
                                {
                                  color: darkmode
                                    ? BaseColors.white
                                    : BaseColors.textColor,
                                },
                              ]}
                            >
                              {patient_question[index]}
                            </Text>
                            <View style={styles.sliderMarker}>
                              <Slider
                                value={sliderValue}
                                onValueChange={handleValueChange}
                                minimumValue={1}
                                maximumValue={8}
                                thumbStyle={styles.thumbStyle}
                                trackStyle={styles.trackStyle}
                                minimumTrackTintColor={BaseColors.primary}
                                maximumTrackTintColor={BaseColors.tabinActive}
                                thumbTintColor={BaseColors.white}
                                style={styles.slider}
                                step={1}
                                onSlidingComplete={() => setCount(count + 1)}
                              />
                              {/* Marker Vertical Lines */}
                              <View style={styles.markerContainer}>
                                {['', 0, 1, 2, 3, 4, 5, 6].map((marker, i) => (
                                  <View
                                    style={
                                      i === 0
                                        ? null
                                        : [
                                            styles.marker,
                                            {
                                              backgroundColor:
                                                prevTag[index] + 1 === i
                                                  ? BaseColors.secondary
                                                  : BaseColors.textGrey,
                                              fontWeight: 'bold',
                                            },
                                          ]
                                    }
                                    key={marker.toString()}
                                  />
                                ))}
                              </View>
                            </View>

                            <View style={styles.markerContainerNumber}>
                              {['', 0, 1, 2, 3, 4, 5, 6].map((label, i) =>
                                i === 0 ? (
                                  <Text key={label.toString()}>&nbsp;</Text>
                                ) : (
                                  <Text
                                    style={[
                                      styles.sliderLabel,
                                      {
                                        color:
                                          prevTag[index] + 1 === i
                                            ? BaseColors.secondary
                                            : BaseColors.textGrey,
                                        fontWeight: 'bold',
                                      },
                                    ]}
                                    key={label.toString()}
                                  >
                                    {label}
                                  </Text>
                                ),
                              )}
                            </View>

                            <View>
                              <View style={styles.lables}>
                                <Text
                                  style={{
                                    fontFamily: FontFamily?.light,
                                    color: darkmode
                                      ? BaseColors.white
                                      : BaseColors.black90,
                                  }}
                                >
                                  None
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily?.light,
                                    color: darkmode
                                      ? BaseColors.white
                                      : BaseColors.black90,
                                  }}
                                >
                                  Mild
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily?.light,
                                    color: darkmode
                                      ? BaseColors.white
                                      : BaseColors.black90,
                                  }}
                                >
                                  Moderate
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: FontFamily?.light,
                                    color: darkmode
                                      ? BaseColors.white
                                      : BaseColors.black90,
                                  }}
                                >
                                  Sever
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.topBox}>
                            <View style={styles.outer}>
                              <View style={styles.inner} />
                              <Text
                                style={{
                                  fontFamily: FontFamily?.light,
                                  color: darkmode
                                    ? BaseColors.white
                                    : BaseColors.black90,
                                }}
                              >
                                Previous Assessment
                              </Text>
                            </View>
                            <View style={styles.assessmentHead}>
                              <View style={styles.assessmentData} />
                              <Text
                                style={{
                                  fontFamily: FontFamily?.light,
                                  color: darkmode
                                    ? BaseColors.white
                                    : BaseColors.black90,
                                }}
                              >
                                Current Assessment
                              </Text>
                            </View>
                          </View>
                        </>
                      )
                    );
                  })}
                </View>
              ) : (
                <View>
                  {boolQuestion
                    ?.map((item, rowIndex) => {
                      const activeIndex = activeIndexes[rowIndex]; // Get the active index for this row

                      return (
                        <View key={rowIndex}>
                          <Text
                            style={{
                              fontSize: 18,
                              marginVertical: 5,
                              color: darkmode
                                ? BaseColors.white
                                : BaseColors.textColor,
                            }}
                          >
                            {item}{' '}
                            <Text style={{ color: BaseColors.orange }}>*</Text>
                          </Text>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                              style={[
                                styles.btnStyle,
                                {
                                  backgroundColor:
                                    activeIndex === 0
                                      ? BaseColors.secondary
                                      : BaseColors.white,
                                },
                              ]}
                              onPress={() =>
                                handleButtonPress(item, true, rowIndex, 0)
                              }
                            >
                              <Text
                                style={{
                                  color:
                                    activeIndex === 0
                                      ? BaseColors.white
                                      : BaseColors.textColor,
                                }}
                              >
                                Yes
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.btnStyle,
                                {
                                  backgroundColor:
                                    activeIndex === 1
                                      ? BaseColors.secondary
                                      : BaseColors.white,
                                },
                              ]}
                              onPress={() =>
                                handleButtonPress(item, false, rowIndex, 1)
                              }
                            >
                              <Text
                                style={{
                                  color:
                                    activeIndex === 1
                                      ? BaseColors.white
                                      : BaseColors.textColor,
                                }}
                              >
                                No
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })
                    .slice(next, next + 1)}
                  {next === 2 && (
                    <View>
                      {inputQuestion?.map((item, index) => {
                        return (
                          <View>
                            <Text
                              style={{
                                fontSize: 18,
                                color: darkmode
                                  ? BaseColors.white
                                  : BaseColors.textColor,
                              }}
                            >
                              {item}
                            </Text>
                            <LabeledInput
                              keyboardType={'numeric'}
                              maxLength={3}
                              value={text}
                              onChangeText={e => {
                                if (e !== '') {
                                  const numericValue = parseFloat(e);
                                  if (
                                    !isNaN(numericValue) &&
                                    numericValue >= 0
                                  ) {
                                    setText(numericValue.toString()); // Accept valid input
                                    setPercentage(numericValue.toString());
                                    setTextErrObj({ error: false, msg: '' });
                                  } else {
                                    setTextErrObj({
                                      error: true,
                                      msg: 'Enter a valid number >= 0',
                                    });
                                  }
                                } else {
                                  setText(''); // Allow clearing the input
                                  setPercentage('');
                                  setTextErrObj({ error: false, msg: '' });
                                }
                              }}
                              showError={textErrObj.error}
                              errorText={textErrObj.msg}
                            />
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              <View style={styles.btnContainer}>
                {!takeBoolean ? (
                  <Button
                    shape="round"
                    title={'Next'}
                    style={styles.signinbutton}
                    onPress={() => {
                      setCount(0);
                      setRevisit(0);
                      setDuration(0);
                      handleSymptomChange(activeButtonIndex + 1);
                    }}
                  />
                ) : (
                  next !== 2 && (
                    <Button
                      shape="round"
                      title={'Next'}
                      style={styles.signinbutton}
                      onPress={() => {
                        // SubmitSymptom();
                        checkNext();
                      }}
                    />
                  )
                )}
                {next === 2 && (
                  <Button
                    shape="round"
                    title={'Submit'}
                    style={styles.signinbutton}
                    onPress={() => {
                      SubmitSymptom();
                    }}
                    loading={btnLoad}
                  />
                )}
              </View>
            </View>
          )}

          <Animated.View
            style={useAnimatedStyle(() => {
              return {
                width: dynamicDot ? 20 : 0,
                height: dynamicDot ? 20 : 0,
                borderRadius: 10,
                backgroundColor: 'red',
                position: 'absolute',
                left: -20,
                top: -20,
                transform: [
                  {
                    translateX: tXValue.value,
                  },
                  {
                    translateY: tYValue.value,
                  },
                ],
              };
            })}
          />
        </>
        {showConfirmation && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmation}
            onRequestClose={handleCancel}
          >
            <View style={styles.confirmationModalCenteredView}>
              <View
                style={[
                  styles.confirmationModalView,
                  {
                    backgroundColor: darkmode
                      ? BaseColors.textColor
                      : BaseColors.white,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.confirmationModalTitleText,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.black,
                    },
                  ]}
                >
                  Are you sure?
                </Text>
                <Text
                  style={[
                    styles.confirmationModalText,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.black,
                    },
                  ]}
                >
                  You want to leave this screen?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleConfirm}
                    disabled={confirmLoading}
                  >
                    {confirmLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </View>
  );
};

export default Symptoms;
