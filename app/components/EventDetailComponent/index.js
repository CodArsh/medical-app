import React from 'react';
import {
  processColor,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseSetting from '@config/setting';
import { BaseColors } from '@config/theme';
import { LineChart } from 'react-native-charts-wrapper';
import styles from './styles';
import Icon2 from 'react-native-vector-icons/AntDesign';

function EventDetailComponent({
  eventDetail,
  datas,
  navigation,
  darkmode,
  eventDescriptions,
  getSymptomIconComponent,
  calculateIconColor,
}) {
  const convertDataForChart = data => {
    const chartData = {
      dataSets: [],
    };

    for (const [eventType, eventData] of Object.entries(data)) {
      const dataSet = {
        label: eventType,
        values: eventData.map(item => item.value),

        config: {
          color: processColor(BaseColors.primary),
          drawValues: false,
          drawCircles: false,
          lineWidth: 2,
          drawCubicInterpolation: true,
          circleRadius: 5,
          drawFilled: true,
          fillAlpha: 0.5,
        },
      };

      chartData.dataSets.push(dataSet);
    }

    return chartData;
  };

  const CommonLineChart = ({ eventName, data }) => {
    return (
      <View style={styles.commonLineChartContainer}>
        <LineChart
          data={convertDataForChart({ [eventName]: data })}
          drawValues={false}
          drawCircles={false}
          xAxis={{ drawLabels: false, drawGridLines: false, enabled: false }}
          yAxisLeft={{ drawLabels: false, drawGridLines: false }}
          chartDescription={{ text: '' }}
          legend={{ enabled: false }}
          style={{ width: 131, height: 60 }}
          drawXAxis={false}
          yAxisRight={null}
          drawYAxis={false}
          drawGridBackground={false}
          yAxis={{
            left: {
              granularity: 6,
              drawLabels: false, // Hide labels on the y-axis
              drawGridLines: false, // Hide grid lines on the y-axis
              drawYAxis: false,
              enabled: false,
            },
            right: {
              enabled: false,
              drawGridLines: false, // Hide grid lines on the y-axis
              drawYAxis: false,
            },
          }}
          chartConfig={{
            drawGridBackground: false,
          }}
        />
      </View>
    );
  };

  const calculateArrow = (prevValue, value) => {
    const diff = value - prevValue;
    return diff > 0 ? 'caretup' : diff < 0 ? 'caretdown' : 'equal';
  };

  // Filter symptoms with all values equal to 0
  const filteredSymptoms = Object.keys(eventDetail).filter(eventName => {
    const symptomData = eventDetail[eventName];
    return symptomData.some(item => item.value !== 0);
  });

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {filteredSymptoms.map((eventName, index) => (
          <TouchableOpacity
            key={eventName}
            style={[
              styles.eventContainer,
              {
                backgroundColor: darkmode
                  ? BaseColors.lightBlack
                  : BaseColors.white,
              },
            ]}
            onPress={() => {
              navigation.navigate('Dashboard', {
                eventName: eventName,
                eventData: eventDetail[eventName],
                title: datas.title,
                eventDetail: eventDetail,
                dotnumber: index,
              });
            }}
            activeOpacity={BaseSetting.buttonOpacity}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ height: 60, width: 100 }}>
                <Text
                  style={[
                    styles.textt,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                >
                  {`${eventDescriptions[eventName]}`}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                {getSymptomIconComponent(eventName)}
              </View>
            </View>
            <CommonLineChart
              eventName={eventName}
              data={eventDetail[eventName]}
            />
            {eventDetail[eventName]
              .filter(
                item =>
                  item.prev_value !== undefined &&
                  item.value !== undefined &&
                  item.date !== 0.001, // Exclude items with date value of 0.001
              )
              .map(item => (
                <View key={item.date} style={styles.itemContainer}>
                  <Text
                    style={{
                      color: calculateIconColor(item.prev_value, item.value),
                      marginRight: 3,
                    }}
                  >
                    {Math.round(Math.abs(item.prev_value - item.value))}
                  </Text>
                  <View style={{ marginTop: 2 }}>
                    {calculateArrow(item.prev_value, item.value) === 'equal' ? (
                      <Text
                        style={{
                          fontSize: 16,
                          color: calculateIconColor(
                            item.prev_value,
                            item.value,
                          ),
                        }}
                      >
                        =
                      </Text>
                    ) : (
                      <Icon2
                        name={calculateArrow(item.prev_value, item.value)}
                        size={10}
                        color={calculateIconColor(item.prev_value, item.value)}
                      />
                    )}
                  </View>
                </View>
              ))}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default EventDetailComponent;
