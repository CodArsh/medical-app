import {
  View,
  Text,
  Image,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { Images } from '@config';
import TabSwitch from '@components/TabSwitch';
import Button from '@components/Button';
import Milestones from '@components/Milestones';
import { useDispatch, useSelector } from 'react-redux';
import { BaseColors, FontFamily, Typography } from '@config/theme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AuthAction from '@redux/reducers/auth/actions';
import {
  IntenseSVG,
  LightSVG,
  ModerateSVG,
  RelativeSVG,
  ReturnSVG,
  SvgRelativeRest,
  SymptomSVG,
} from '@components/SVG_Bundle';
import Tooltip from 'react-native-walkthrough-tooltip';
import {
  AppTour,
  AppTourSequence,
  AppTourView,
} from 'imokhles-react-native-app-tour';
import EventDetailComponent from '@components/EventDetailComponent';
import {
  BalanceProblemsw,
  BlurredVisionw,
  Confusionw,
  DifficultyConcentratingw,
  DifficultyRememberingw,
  Dizzinessw,
  DontFeelRightw,
  Drowsinessw,
  Fatiguew,
  Feelinginafogw,
  FeelingSlowedDownsw,
  Headachew,
  Irritabilityw,
  Moreemotionalw,
  Nauseaw,
  NeckPainw,
  Nervousness_Anxiousnessw,
  PressureinHeadw,
  Sadnessw,
  SensitivitytoLightw,
  SensitivitytoNoisew,
  TroubleFallingAsleepw,
} from '@components/SVG_Bundle';
import LottieView from 'lottie-react-native';

import AuthenticationFactor from '@screens/Authentication';
import Authentication from '@redux/reducers/auth/actions';
import { store } from '@redux/store/configureStore';
import { useIsFocused } from '@react-navigation/native';

const datas = {
  assmt_time: null,
  assmt_type: 'Subsequent Visit',
  createdAt: 'Dec 1, 2023 3:23 PM',
  created_by: 13,
  created_from: 'web',
  datetime_of_injury: '',
  digit_recall: 1,
  event_name: 'Immediate Post Injury',
  event_type: '2',
  eye_tracking: null,
  graph: true,
  id: 9,
  immediate_recall: 1,
  is_red_flag: null,
  is_request: null,
  patient_id: 9,
  provider_notice: null,
  reject_reason: null,
  reopen_reason: null,
  rta_data: null,
  status: '1',
  symptom_info: 1,
  title: 'Dec 1',
  treatment_info: null,
  updatedAt: 'Dec 1, 2023 3:26 PM',
  updated_by: null,
};

export default function Home({ navigation }) {
  const { setIntroMode, setShowAppTour } = AuthAction;
  const [activeStage, setActiveStage] = useState('Relative Rest');
  const [RTA_Description, setRTA_Description] = useState(
    'Avoid symptom provocation, and rest to promote recovery',
  );
  const isFocused = useIsFocused();

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const stages = [
    'Relative Rest',
    'Symptom Limited\nActivity',
    'Light Activity',
    'Moderate Activity',
    'Intense Activity',
    'Return to Activity',
  ];
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [btnLoad, setBtnLoad] = useState(false);
  const tempRTAStage = () => {
    switch (stages[activeStageIndex]) {
      case 'Relative Rest':
        // setActiveStage('Symptom Limited Activity');
        setRTA_Description(
          'Avoid symptom provocation, and rest to promote recovery',
        );
        break;

      case 'Symptom Limited\nActivity':
        // setActiveStage('Light Activity');
        setRTA_Description('Introduce and promote mild exertion');
        break;

      case 'Light Activity':
        // setActiveStage('Moderate Activity');
        setRTA_Description(
          'Introduce occupation-specific exertion and environmental distractions',
        );
        break;

      case 'Moderate Activity':
        // setActiveStage('Intense Activity');
        setRTA_Description('Increase activity intensity and duration');
        break;

      case 'Intense Activity':
        // setActiveStage('Return to Activity');
        setRTA_Description('Introduce exertion of duration and intensity');
        break;

      case 'Return to Activity':
        // setActiveStage('Relative Rest');
        setRTA_Description('Return to pre-injury activities');
        break;
    }
    setActiveStageIndex(prevIndex => (prevIndex + 1) % stages.length);
  };

  const DynamicRTA = () => {
    return (
      <View style={{ marginLeft: 5 }}>
        <Text style={styles.rta}>RTA Stage</Text>
        <Tooltip
          isVisible={tooltipVisable}
          content={<Text>{RTA_Description}</Text>}
          placement="top"
          onClose={() => setTooltipVisable(false)}
          contentStyle={{ backgroundColor: '#ffffe6' }}
          pointerColor="transparent"
          useInteractionManager
        >
          <TouchableHighlight
            underlayColor={'transparent'}
            onPress={() => setTooltipVisable(true)}
          >
            <Text
              style={{
                color: darkmode ? BaseColors.white : BaseColors.black90,
              }}
            >
              {stages[activeStageIndex]}
            </Text>
          </TouchableHighlight>
        </Tooltip>
      </View>
    );
  };
  const introMode = store.getState().auth.introMode;
  console.log('TCL: Home -> introMode', introMode);

  const [eventDetail, setEventDetail] = useState({
    balance: [{ date: 'Dec 1', value: null }],
    confused: [{ date: 'Dec 1', value: null }],
    diff_concen: [{ date: 'Dec 1', value: null }],
    diff_rem: [{ date: 'Dec 1', value: null }],
    dizziness: [{ date: 'Dec 1', value: null }],
    drowsy: [{ date: 'Dec 1', value: null }],
    emotional: [{ date: 'Dec 1', value: null }],
    fatigue: [{ date: 'Dec 1', value: null }],
    foggy: [{ date: 'Dec 1', value: null }],
    headache: [{ date: 'Dec 1', value: null }],
    irritable: [{ date: 'Dec 1', value: null }],
    nausea: [{ date: 'Dec 1', value: null }],
    neck_pain: [{ date: 'Dec 1', value: null }],
    nerv_anx: [{ date: 'Dec 1', value: null }],
    not_right: [{ date: 'Dec 1', value: null }],
    press_head: [{ date: 'Dec 1', value: null }],
    sad_dep: [{ date: 'Dec 1', value: null }],
    sens_light: [{ date: 'Dec 1', value: null }],
    sens_noise: [{ date: 'Dec 1', value: null }],
    slow: [{ date: 'Dec 1', value: null }],
    trouble_sleep: [{ date: 'Dec 1', value: null }],
    vis_prob: [{ date: 'Dec 1', value: null }],
  });
  const [tooltipVisable, setTooltipVisable] = useState(false);
  const switchOptions = [
    { id: 'summary', name: 'Summary' },
    { id: 'details', name: 'Details' },
  ];

  const [activeTab, setActiveTab] = useState({
    id: 'summary',
    name: 'Summary',
  });

  const { userData, darkmode, showAppTour } = useSelector(state => state.auth);

  const [hideRequestButton, setHideRequestButton] = useState(false);

  async function handlegetData() {
    setBtnLoad(true);
    const endPoint = BaseSetting.endpoints.createRequest;
    try {
      const response = await getApiData(`${endPoint}`, 'GET');
      if (response?.status) {
        setBtnLoad(false);
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
      } else {
        setBtnLoad(false);
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
      setBtnLoad(false);
    } catch (error) {
      setBtnLoad(false);
      console.log('error =======>>>', error);
    }
  }
  const dispatch = useDispatch();
  const eventDescriptions = {
    headache: 'Headache',
    press_head: 'Pressure in Head',
    neck_pain: 'Neck Pain',
    nausea: 'Nausea',
    dizziness: 'Dizziness',
    vis_prob: 'Blurred Vision/Vision',
    balance: 'Balance Problem',
    sens_light: 'Sensitivity to Light',
    sens_noise: 'Sensitivity to Noise',
    slow: 'Feeling Slowed Down',
    foggy: 'Feeling like a Fog',
    not_right: "Don't Feel Right",
    diff_concen: 'Difficulty Concentrating',
    diff_rem: 'Difficulty Remembering',
    fatigue: 'Fatigue / Low Energy',
    confused: 'Confusion',
    drowsy: 'Drowsiness',
    emotional: 'More emotional',
    irritable: 'Irritability',
    sad_dep: 'Sadness',
    nerv_anx: 'Nervous / Anxiousness',
    trouble_sleep: 'Trouble Falling Asleep',
  };
  const calculateIconColor = (prevValue, value) => {
    const diff = Math.abs(value - prevValue);

    if (diff === 0) {
      return BaseColors.black400;
    } else if (diff === 1) {
      return BaseColors.primaryBlue300;
    } else if (diff === 2) {
      return BaseColors.primaryBlue400;
    } else if (diff === 3) {
      return BaseColors.primaryBlue500;
    } else if (diff === 4) {
      return BaseColors.primaryBlue600;
    } else if (diff === 5) {
      return BaseColors.primaryBlue700;
    } else if (diff === 6) {
      return BaseColors.primaryBlue900;
    } else {
      return BaseColors.black400;
    }
  };
  function getSymptomIconComponent(symptomName) {
    const symptomIcons = {
      headache: <Headachew height={15} width={15} />,
      press_head: <PressureinHeadw height={15} width={15} />,
      neck_pain: <NeckPainw height={15} width={15} />,
      nausea: <Nauseaw height={15} width={15} />,
      dizziness: <Dizzinessw height={15} width={15} />,
      vis_prob: <BlurredVisionw height={15} width={15} />,
      balance: <BalanceProblemsw height={15} width={15} />,
      sens_light: <SensitivitytoLightw height={15} width={15} />,
      sens_noise: <SensitivitytoNoisew height={15} width={15} />,
      slow: <FeelingSlowedDownsw height={15} width={15} />,
      foggy: <Feelinginafogw height={15} width={15} />,
      not_right: <DontFeelRightw height={15} width={15} />,
      diff_concen: <DifficultyConcentratingw height={15} width={15} />,
      diff_rem: <DifficultyRememberingw height={15} width={15} />,
      fatigue: <Fatiguew height={15} width={15} />,
      confused: <Confusionw height={15} width={15} />,
      drowsy: <Drowsinessw height={15} width={15} />,
      emotional: <Moreemotionalw height={15} width={15} />,
      irritable: <Irritabilityw height={15} width={15} />,
      sad_dep: <Sadnessw height={15} width={15} />,
      nerv_anx: <Nervousness_Anxiousnessw height={15} width={15} />,
      trouble_sleep: <TroubleFallingAsleepw height={15} width={15} />,
    };

    // Check if the symptomName exists in the symptomIcons object
    if (symptomIcons.hasOwnProperty(symptomName)) {
      // Return the corresponding SVG component if found
      return symptomIcons[symptomName];
    } else {
      return null;
    }
  }

  useEffect(() => {
    registerSequenceStepEvent();
    registerFinishSequenceEvent();
  }, []);

  let appTourTargets = [];

  const showTourGuide = () => {
    const {
      auth: { appTour },
    } = store.getState();
    console.log('TCL: showTourGuide -> appTour', appTour);
    let appTourSequence = new AppTourSequence();
    const mergeArr = appTourTargets.concat(appTour);
    const sortArr = mergeArr.sort((a, b) => a.order - b.order);
    sortArr.forEach(appTourTarget => {
      appTourSequence.add(appTourTarget);
    });
    AppTour.ShowSequence(appTourSequence);
  };

  useEffect(() => {
    if (showAppTour?.home) {
      setTimeout(showTourGuide, 300);
    }
  }, []);

  useEffect(() => {
    if (!showAppTour?.home) {
      EventListData();
    }
  }, [isFocused, showAppTour]);

  const registerSequenceStepEvent = () => {
    if (sequenceStepListener) {
      sequenceStepListener.remove();
    }
    const sequenceStepListener = DeviceEventEmitter.addListener(
      'onShowSequenceStepEvent',
      e => {
        console.log(e);
      },
    );
  };

  const registerFinishSequenceEvent = () => {
    if (finishSequenceListener) {
      finishSequenceListener.remove();
    }
    const finishSequenceListener = DeviceEventEmitter.addListener(
      'onFinishSequenceEvent',
      e => {
        if (e?.finish) {
          dispatch(setShowAppTour({ home: false }));
          console.log(e);
        }
      },
    );
  };

  // this function is used to get event list
  const EventListData = async () => {
    const endPoint = `${BaseSetting.endpoints.eventList}?created_from=app`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        let injuryEventOpenStatus = false;
        res?.data?.events?.map((item, index) => {
          if (item?.status == 1 && item?.event_type != 1) {
            injuryEventOpenStatus = true;
          }
        });
        setHideRequestButton(injuryEventOpenStatus);
      } else {
        Toast.show({
          text1: res?.message.toString(),
          type: 'error',
        });
      }
    } catch (error) {
      Toast.show({
        text1: error.toString(),
        type: 'error',
      });
      console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.main,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
      >
        {/* TOP HEADER  */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileStackNavigator')}
              ref={ref => {
                if (!ref) return;
                let props = {
                  order: 6,
                  title: `User Profile`,
                  description: ` This part introduces the user's profile picture`,
                  titleTextSize: 20,
                  descriptionTextSize: 12,
                  targetRadius: 90,
                  titleTextColor: BaseColors.whiteColor,
                  descriptionTextColor: BaseColors.whiteColor,
                  fontFamily: FontFamily.semibold,
                  outerCircleColor: BaseColors.primary,
                  // cancelable: false,  // uncomment this if you want to add only close when user click in circle
                  targetCircleColor: BaseColors.whiteColor,
                };
                appTourTargets.push(
                  AppTourView.for(ref, {
                    ...props,
                  }),
                );
              }}
              style={{ borderRadius: 50, overflow: 'hidden', elevation: 1 }}
            >
              <Image
                source={
                  userData?.profile_pic
                    ? { uri: userData?.profile_pic }
                    : Images.avatar
                }
                resizeMode="cover"
                style={{
                  height: 60,
                  width: 60,
                }}
              />
            </TouchableOpacity>

            <Pressable style={styles.title} onPress={() => tempRTAStage()}>
              <Text style={styles.name}>
                Hi,{' '}
                {userData?.firstname?.length > 15
                  ? userData?.firstname?.substring(0, 15) + '.....'
                  : userData?.firstname}
              </Text>
              <Text
                style={[
                  styles.welcomeText,
                  { color: darkmode ? BaseColors.white : BaseColors.black90 },
                ]}
              >
                Welcome to Oculabs
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              marginRight: 20,
              flexDirection: 'row',
              alignItems: 'center',
              width: BaseSetting.nWidth / 3.2,
            }}
          >
            <View style={{ width: '27%' }}>
              {stages[activeStageIndex] === 'Relative Rest' && <RelativeSVG />}
              {stages[activeStageIndex] === 'Symptom Limited\nActivity' && (
                <SymptomSVG />
              )}
              {stages[activeStageIndex] === 'Light Activity' && <LightSVG />}
              {stages[activeStageIndex] === 'Moderate Activity' && (
                <ModerateSVG />
              )}
              {stages[activeStageIndex] === 'Intense Activity' && (
                <IntenseSVG />
              )}
              {stages[activeStageIndex] === 'Return to Activity' && (
                <ReturnSVG />
              )}
            </View>

            <View style={{ width: '80%' }}>
              <TouchableOpacity
                ref={ref => {
                  if (!ref) return;

                  let props = {
                    order: 7,
                    title: 'RTA Stage',
                    description: 'This is the current RTA stage.',
                    titleTextSize: 20,
                    descriptionTextSize: 12,
                    targetRadius: 90,
                    titleTextColor: BaseColors.whiteColor,
                    descriptionTextColor: BaseColors.whiteColor,
                    fontFamily: FontFamily.semibold,
                    outerCircleColor: BaseColors.primary,
                    // cancelable: false,  // uncomment this if you want to add only close when user click in circle
                    targetCircleColor: BaseColors.whiteColor,
                  };
                  appTourTargets.push(
                    AppTourView.for(ref, {
                      ...props,
                    }),
                  );
                }}
                onPress={() => setTooltipVisible(true)}
              >
                <Text
                  style={{
                    color: darkmode ? BaseColors.white : BaseColors.black90,
                  }}
                >
                  {stages[activeStageIndex]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SWITCH TAB */}
        <TouchableOpacity
          ref={ref => {
            if (!ref) return;

            let props = {
              order: 8,
              title: 'Summary & Details',
              description: 'This is the summary & details tab.',
              titleTextSize: 20,
              descriptionTextSize: 12,
              targetRadius: 180,
              titleTextColor: BaseColors.whiteColor,
              descriptionTextColor: BaseColors.whiteColor,
              fontFamily: FontFamily.semibold,
              outerCircleColor: BaseColors.primary,
              // cancelable: false,  // uncomment this if you want to add only close when user click in circle
              targetCircleColor: BaseColors.whiteColor,
            };
            appTourTargets.push(
              AppTourView.for(ref, {
                ...props,
              }),
            );
          }}
        >
          <TabSwitch
            tabs={switchOptions}
            activeTab={activeTab}
            onTabChange={currentTab => {
              setActiveTab(currentTab);
            }}
          />
        </TouchableOpacity>

        {/* ACTIVE TAB AREA */}
        {activeTab?.id === 'summary' ? (
          <View
            style={[
              styles.summaryArea,
              {
                backgroundColor: darkmode
                  ? BaseColors.white20
                  : BaseColors.white,
              },
            ]}
          >
            {!hideRequestButton ? (
              <Animated.View entering={FadeIn} style={styles.requestBtn}>
                <TouchableOpacity
                  ref={ref => {
                    if (!ref) return;

                    let props = {
                      order: 5,
                      title: 'Request Another Baseline',
                      description:
                        'This part introduces a button labeled "Request Another Baseline".Click here to request another baseline.',
                      titleTextSize: 20,
                      descriptionTextSize: 12,
                      targetRadius: 160,
                      titleTextColor: BaseColors.whiteColor,
                      descriptionTextColor: BaseColors.whiteColor,
                      fontFamily: FontFamily.semibold,
                      outerCircleColor: BaseColors.primary,
                      targetCircleColor: BaseColors.whiteColor,
                    };
                    appTourTargets.push(
                      AppTourView.for(ref, {
                        ...props,
                      }),
                    );
                  }}
                >
                  <Button
                    style={{ marginTop: 5 }}
                    onPress={handlegetData}
                    shape="round"
                    title={'Request Another Baseline'}
                    loading={btnLoad}
                  />
                </TouchableOpacity>
              </Animated.View>
            ) : null}
          </View>
        ) : (
          <EventDetailComponent
            eventDetail={eventDetail}
            datas={datas}
            navigation={navigation}
            darkmode={darkmode}
            eventDescriptions={eventDescriptions}
            getSymptomIconComponent={getSymptomIconComponent}
            calculateIconColor={calculateIconColor}
          />
        )}
      </View>
    </View>
  );
}
