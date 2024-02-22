import {
  View,
  Text,
  ScrollView,
  Keyboard,
  TextInput,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import styles from './styles';

import Button from '@components/Button';

import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import Tooltip from 'react-native-walkthrough-tooltip';
import { isEmpty } from 'lodash';
import Cutomspiderchart from '@components/Cutomspiderchart.js';
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
const wrapData = [
  {
    curr_value: 6,
    initial_value: 2,
    label: 'headache',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'press_head',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'neck_pain',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'nausea',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'dizziness',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'vis_prob',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'balance',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'sens_light',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'sens_noise',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'slow',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'foggy',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'not_right',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'diff_concen',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'diff_rem',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'fatigue',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'confused',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'drowsy',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'emotional',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'irritable',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'sad_dep',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'nerv_anx',
  },
  {
    curr_value: Math.floor(Math.random() * 7),
    initial_value: Math.floor(Math.random() * 7),
    label: 'trouble_sleep',
  },
];
export default function ExampleRadarChart({ navigation }) {
  const [activeStage, setActiveStage] = useState('Relative Rest');
  const [RTA_Description, setRTA_Description] = useState(
    'Avoid symptom provocation, and rest to promote recovery',
  );

  const stages = [
    'Relative Rest',
    'Symptom Limited\nActivity',
    'Light Activity',
    'Moderate Activity',
    'Intense Activity',
    'Return to Activity',
  ];
  const [activeStageIndex, setActiveStageIndex] = useState(0);
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
        {/* <Tooltip
          isVisible={tooltipVisable}
          content={<Text>{RTA_Description}</Text>}
          placement="top"
          onClose={() => setTooltipVisable(false)}
          contentStyle={{ backgroundColor: '#ffffe6' }}
          placement={'bottom'}
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
        </Tooltip> */}
      </View>
    );
  };

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

  const [selectedNumber, setSelectedNumber] = useState('');
  const [filteredData, setFilteredData] = useState([
    {
      curr_value: 2,
      initial_value: 6,
      label: 'headache',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'press_head',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'neck_pain',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'nausea',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'dizziness',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'vis_prob',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'balance',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'sens_light',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'sens_noise',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'slow',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'foggy',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'not_right',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'diff_concen',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'diff_rem',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'fatigue',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'confused',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'drowsy',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'emotional',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'irritable',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'sad_dep',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'nerv_anx',
    },
    {
      curr_value: Math.floor(Math.random() * 7),
      initial_value: Math.floor(Math.random() * 7),
      label: 'trouble_sleep',
    },
  ]);
  console.log('TCL: Home -> filteredData', filteredData);

  const handleNumberChange = number => {
    setSelectedNumber(number);
  };

  const handleShowChart = () => {
    Keyboard.dismiss();
    // Convert the entered string to a number
    const numberOfItems = parseInt(selectedNumber, 10);

    // Validate if the entered number is a valid positive integer
    if (!isNaN(numberOfItems) && numberOfItems > 0) {
      // Update the filtered data based on the entered number
      setFilteredData(wrapData.slice(0, numberOfItems));
    } else {
      // Handle invalid input (you can show an alert, error message, etc.)
      console.log('Please enter a valid positive integer');
    }
  };

  const { userData, darkmode } = useSelector(state => state.auth);
  console.log('🚀 ~ file: index.js:23 ~ Home ~ userData:', userData);

  async function handlegetData() {
    const endPoint = BaseSetting.endpoints.createRequest;
    try {
      const response = await getApiData(`${endPoint}`, 'GET');
      if (response?.status) {
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
      } else {
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log('error =======>>>', error);
    }
  }

  const hasMoreThan14Values = filteredData?.length > 14;
  const sortedData = filteredData?.sort(
    (a, b) => b.initial_value - a.initial_value,
  );

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
  return (
    // MAIN CONTAINER
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      {/* TOP HEADER */}
      {/* <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={
              userData?.profile_pic
                ? { uri: userData?.profile_pic }
                : Images.avatar
            }
            resizeMode="cover"
            style={{ height: 60, width: 60, borderRadius: 30, borderWidth: 1 }}
          />

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
            marginRight: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 10,
          }}
        >
          {stages[activeStageIndex] === 'Relative Rest' && <RelativeSVG />}
          {stages[activeStageIndex] === 'Symptom Limited\nActivity' && (
            <SymptomSVG />
          )}
          {stages[activeStageIndex] === 'Light Activity' && <LightSVG />}
          {stages[activeStageIndex] === 'Moderate Activity' && <ModerateSVG />}
          {stages[activeStageIndex] === 'Intense Activity' && <IntenseSVG />}
          {stages[activeStageIndex] === 'Return to Activity' && <ReturnSVG />}
          <DynamicRTA />
        </View>
      </View> */}
      {/* SWITCH TAB */}
      {/* <TabSwitch
        tabs={switchOptions}
        activeTab={activeTab}
        onTabChange={currentTab => {
          setActiveTab(currentTab);
        }}
      /> */}
      {/* ACTIVE TAB AREA */}
      {activeTab?.id === 'summary' ? (
        <View
          style={[
            styles.summaryArea,
            {
              backgroundColor: darkmode ? BaseColors.white20 : BaseColors.white,
            },
          ]}
        >
          <View style={styles.container}>
            <View horizontal>
              {hasMoreThan14Values && !isEmpty(filteredData) ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  pinchGestureEnabled
                  showsHorizontalScrollIndicator={false}
                >
                  {/* Slide 1 */}
                  <View style={{ flex: 1, width: '100%' }}>
                    <Cutomspiderchart
                      data={
                        hasMoreThan14Values
                          ? sortedData.slice(0, 11)
                          : filteredData?.slice(0, 11)
                      }
                      size={800}
                      axesSvg={{ strokeWidth: 2 }}
                    />

                    <Text style={styles.page}>Page 1/2</Text>
                  </View>

                  {/* Slide 2 */}
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      marginLeft: Platform.OS === 'android' ? -5 : -5,
                    }}
                  >
                    <Cutomspiderchart
                      data={
                        hasMoreThan14Values
                          ? sortedData.slice(11)
                          : filteredData?.slice(11)
                      }
                      size={800}
                      axesSvg={{ strokeWidth: 2 }}
                    />
                    <Text style={styles.page}>Page 2/2</Text>
                  </View>
                </ScrollView>
              ) : (
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    marginLeft: BaseSetting.nWidth / (25 * 2),
                  }}
                >
                  {!isEmpty(filteredData) && (
                    <Cutomspiderchart
                      data={filteredData}
                      size={800}
                      axesSvg={{ strokeWidth: 2 }}
                    />
                  )}
                </View>
              )}
            </View>
            <View style={styles.summaryText}></View>
          </View>
          <Animated.View entering={FadeIn} style={styles.requestBtn}>
            <TextInput
              style={styles.input}
              placeholder="Enter number of items"
              keyboardType="numeric"
              value={selectedNumber}
              onChangeText={handleNumberChange}
            />
            <Button
              shape="round"
              title="Show Chart"
              onPress={handleShowChart}
            />
          </Animated.View>
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
  );
}
