import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { Circle, G, Line } from 'react-native-svg';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import styles from './styles';
import { BaseColors, FontFamily } from '@config/theme';
import { useState } from 'react';
import HeaderBar from '@components/HeaderBar';
import BaseSetting from '@config/setting';
import { useSelector } from 'react-redux';

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
const Dashboard = ({ route }) => {
  const indexnumber = route.params.dotnumber;
  const dotdata = route.params.eventDetail;

  console.log('🚀 ~ file: index.js:48 ~ Dashboard ~ dotdata:', dotdata);
  const eventNames = Object?.keys(dotdata);
  const title = route.params.title;
  const { darkmode } = useSelector(state => state.auth);
  const [activeIndex, setActiveIndex] = useState(indexnumber);
  const findMaxValueForItem = item => {
    const itemData = dotdata[item];
    const max = Math.max(...itemData.map(entry => entry.value || 0), 0);
    return max === 0.001 ? 0 : max;
  };

  // Render max value for the selected item
  const renderMaxValue = () => {
    const selectedItem = eventNames[activeIndex];
    const max = findMaxValueForItem(selectedItem);
    return (
      <View>
        <Text style={[styles.number, { color: getNumberColor(max) }]}>
          {`${max}`}
        </Text>
      </View>
    );
  };
  const [currentValue, setCurrentValue] = useState(0);

  const renderCurrentValue = () => {
    const selectedEvent = eventNames[activeIndex];
    const eventData = dotdata[selectedEvent];

    if (!eventData || eventData.length === 0) {
      return null; // Return null if there is no data for the selected event
    }

    const lastEntry = eventData[eventData.length - 1];
    const lastValue = lastEntry.value;

    if (lastValue === 0.001) {
      return null; // Return null if the last value is 0.001
    }

    return (
      <View>
        <Text style={[styles.number, { color: getNumberColor(lastValue) }]}>
          {`${lastValue}`}
        </Text>
      </View>
    );
  };
  const selectedEvent = eventNames[activeIndex];

  function getNumberColor(number) {
    switch (number) {
      case 0:
        return BaseColors.black400;

      case 1:
        return BaseColors.primaryBlue300;
      case 2:
        return BaseColors.primaryBlue400;
      case 3:
        return BaseColors.primaryBlue500;
      case 4:
        return BaseColors.primaryBlue600;
      case 5:
        return BaseColors.primaryBlue700;
      case 6:
        return BaseColors.primaryBlue900;
      default:
        return BaseColors.black400;
    }
  }

  const handleDotPress = index => {
    setActiveIndex(index);
  };
  const currentEventName = eventNames[activeIndex];
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

  // Create a mapping of event names to SVG components
  const eventToSVGComponent = {
    headache: <Headachew height={40} width={40} />,
    press_head: <PressureinHeadw height={40} width={40} />,
    neck_pain: <NeckPainw height={40} width={40} />,
    nausea: <Nauseaw height={40} width={40} />,
    dizziness: <Dizzinessw height={40} width={40} />,
    vis_prob: <BlurredVisionw height={40} width={40} />,
    balance: <BalanceProblemsw height={40} width={40} />,
    sens_light: <SensitivitytoLightw height={40} width={40} />,
    sens_noise: <SensitivitytoNoisew height={40} width={40} />,
    slow: <FeelingSlowedDownsw height={40} width={40} />,
    foggy: <Feelinginafogw height={40} width={40} />,
    not_right: <DontFeelRightw height={40} width={40} />,
    diff_concen: <DifficultyConcentratingw height={40} width={40} />,
    diff_rem: <DifficultyRememberingw height={40} width={40} />,
    fatigue: <Fatiguew height={40} width={40} />,
    confused: <Confusionw height={40} width={40} />,
    drowsy: <Drowsinessw height={40} width={40} />,
    emotional: <Moreemotionalw height={40} width={40} />,
    irritable: <Irritabilityw height={40} width={40} />,
    sad_dep: <Sadnessw height={40} width={40} />,
    nerv_anx: <Nervousness_Anxiousnessw height={40} width={40} />,
    trouble_sleep: <TroubleFallingAsleepw height={40} width={40} />,
  };
  useEffect(() => {
    const selectedEvent = eventNames[activeIndex];
    const mostRecentEntry = dotdata[selectedEvent][0]; // Assuming the data is sorted in descending order
    setCurrentValue(mostRecentEntry.value || 0);
  }, [activeIndex, dotdata, eventNames]);

  const data = dotdata[currentEventName]?.map(entry => entry.value) || [];

  const Decorator = ({ x, y, data }) => {
    const nodes = [];

    for (let index = 0; index < data.length; index++) {
      const value = data[index];

      if (value !== null && !isNaN(value)) {
        const color = getNumberColor(value); // Get color based on the value
        nodes.push(
          <Circle
            key={`circle-${index}`}
            cx={x(index)}
            cy={y(value)}
            r={5}
            stroke={color}
            fill={color}
          />,
        );
      }
    }

    return nodes;
  };

  const eventDatas = dotdata[selectedEvent];

  const filteredData = eventDatas.filter(
    (entry, index) =>
      index % (eventDatas.length > 7 ? 1 : eventDatas.length) === 0,
  );
  const CustomGrid = ({ y, index }) => (
    <G>
      {/* Render horizontal grid lines */}
      {[0, 1, 2, 3, 4, 5, 6].map((tick, index) => (
        <Line
          key={index}
          x1={'0%'}
          x2={'100%'}
          y1={y(index)}
          y2={y(index)}
          // style={{ marginBottom: 55 }}
          stroke={darkmode ? BaseColors.white : BaseColors.black90}
          strokeWidth={0.5}
        />
      ))}
    </G>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkmode ? BaseColors.lightBlack : null,
      }}
    >
      <HeaderBar HeaderText={`Event ${title}`} HeaderCenter leftText="Back" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollcontainer,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageView}>
          <View
            style={{
              backgroundColor: BaseColors.primary,
              height: 70,
              width: 70,
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {eventToSVGComponent[currentEventName]}
          </View>
          <Text
            style={[
              styles.headtext,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            {` ${eventDescriptions[currentEventName]}`}
          </Text>
        </View>
        <View style={styles.subheaderContainer}>
          <View
            style={[
              styles.subheaderContainerr,
              {
                backgroundColor: darkmode
                  ? BaseColors.black70
                  : BaseColors.lightsky,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                },
              ]}
            >
              Baseline
            </Text>
            <Text style={[styles.number, { color: getNumberColor(3) }]}>3</Text>
          </View>
          <View>
            <Text
              style={[
                styles.text,
                { color: darkmode ? BaseColors.white : BaseColors.textColor },
              ]}
            >
              Highest
            </Text>
            {renderMaxValue()}
          </View>
          <View>
            <Text
              style={[
                styles.text,
                { color: darkmode ? BaseColors.white : BaseColors.textColor },
              ]}
            >
              Recent
            </Text>
            {renderCurrentValue()}
          </View>
        </View>

        <View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                transform: [{ rotate: '-90deg' }],
                left: -10,
                top: 110,
                fontSize: 12,
                position: 'absolute',
                fontWeight: '400',
                fontFamily: FontFamily.regular,
                color: darkmode ? BaseColors.white : BaseColors.black,
              }}
            >
              Severity
            </Text>

            <View />
          </View>
        </View>

        <View
          style={{
            paddingLeft: 5,
            justifyContent: 'center',
            width: '80%',
            alignSelf: 'center',
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{}}>
              <LineChart
                style={{
                  height: 250,
                  width: 500,
                  marginLeft: 5,
                  borderLeftWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: BaseColors.black30,
                }}
                data={data}
                contentInset={{ top: 20, bottom: 2.5, left: 5, right: 10 }}
                svg={{
                  stroke: BaseColors.primary,
                  strokeWidth: 1,
                }}
              >
                <CustomGrid />
                <Decorator />
              </LineChart>
              <XAxis
                style={{
                  marginHorizontal: 4,
                  paddingTop: 2,
                  marginTop: 5,
                  backgroundColor: darkmode ? BaseColors.white : 'transparent',
                }}
                data={filteredData}
                formatLabel={(value, index) => {
                  return filteredData[index]?.date || '';
                }}
                contentInset={{ left: 12, right: 20, top: 10, bottom: -5 }}
                svg={{ fontSize: 8, fill: 'black', originY: 30 }}
                showGridLines
              />
            </View>
          </ScrollView>
          <YAxis
            style={{
              position: 'absolute',
              top: 0,
              bottom: -1,
              left: -3,
              backgroundColor: darkmode ? BaseColors.white : 'transparent',
              paddingHorizontal: 1,
            }}
            data={eventDatas}
            contentInset={{ top: 20, bottom: 20 }}
            numberOfTicks={7} // Ensure 6 ticks on the y-axis
            svg={{ fontSize: 10, fill: 'black' }}
            min={0}
            gridMin={1}
            max={Math.max(...eventDatas.map(entry => entry.value || 0))}
            formatLabel={value =>
              Number.isInteger(value) ? value.toString() : ''
            }
          />
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={{
            marginHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.dotwithbordercontainer}>
            {Object.keys(dotdata).map((key, index) => {
              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={BaseSetting.buttonOpacity}
                  onPress={() => {
                    handleDotPress(index);
                  }}
                  style={[
                    {
                      borderColor:
                        activeIndex === index
                          ? BaseColors.primary
                          : BaseColors.black20,
                      margin: 4,
                    },
                    styles.row,
                  ]}
                >
                  <View
                    style={[
                      {
                        borderWidth: activeIndex === index ? 1 : null,
                        borderColor:
                          activeIndex === index
                            ? BaseColors.primary
                            : BaseColors.black20,
                      },
                      styles.dot,
                    ]}
                  >
                    <View
                      style={[
                        styles.round,
                        {
                          backgroundColor:
                            activeIndex === index
                              ? BaseColors.primary
                              : '#B6B7B9',
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
