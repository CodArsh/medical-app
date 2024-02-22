import { BaseColors } from '@config/theme';
import { isEmpty } from 'lodash';
import React from 'react';
import { Platform, processColor } from 'react-native';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { RadarChart } from 'react-native-charts-wrapper';
import { useSelector } from 'react-redux';

const SpiderWebChart = ({ items, bundle, initial, defaultGraph }) => {
  const { darkmode } = useSelector(state => state.auth);
  const values_C = Object?.values(bundle);

  // initial setup
  const dataPointsI = values_C?.map((value, index) => ({
    label: value.label,
    initial_value: value.initial_value,
  }));

  const resultInit = dataPointsI?.reduce((acc, item) => {
    acc[item.label] = item.initial_value;
    return acc;
  }, {});

  // current setup
  const dataPointsC = values_C?.map((value, index) => ({
    label: value.label,
    curr_value: value.curr_value,
  }));

  const result_Curr = dataPointsC?.reduce((acc, item) => {
    acc[item.label] = item.curr_value;
    return acc;
  }, {});

  const newArrInit = [];
  newArrInit.push(resultInit);

  const newArrCurr = [];
  newArrCurr.push(result_Curr);

  const transformedDataInit = Object?.entries(newArrInit[0]).map(
    ([label, value]) => ({
      value,
      label,
    }),
  );

  const transformedDataCurr = Object?.entries(newArrCurr[0]).map(
    ([label, value]) => ({
      value,
      label,
    }),
  );

  // default data
  const keysD = Object?.keys({ ...defaultGraph });
  const valuesD = Object?.values({ ...defaultGraph });
  const dataPointsD = valuesD.map((value, index) => ({
    value,
    label: keysD[index],
  }));

  const filteredDataPointsD = dataPointsD.filter(
    item => item.value !== 0 && item.value !== null,
  );

  const item = Object?.keys(items).map(key => `${key} (${items[key]})`);

  const itemReplacements = {
    press_head: 'Pressure in Head',
    neck_pain: 'Neck Pain',
    vis_prob: 'Vision',
    balance: 'Balance Problem',
    sens_light: 'Sensitivity to Light',
    sens_noise: 'Sensitivity to Noise',
    slow: 'Feeling Slowed Down',
    foggy: 'Feeling like a Fog',
    not_right: 'Dont Feel Right',
    diff_concen: 'Concentrating',
    diff_rem: 'Remembering',
    confused: 'Confusion',
    drowsiness: 'Drowsiness',
    irritability: 'Irritability',
    sad_dep: 'Sadness',
    nerv_anx: 'Nervous',
    trouble_sleep: 'Trouble Falling Asleep',
  };

  const updatedData = item?.map(item => {
    for (const key in itemReplacements) {
      if (item.startsWith(key)) {
        return item.replace(key, itemReplacements[key]);
      }
    }
    return item;
  });

  const mainItems = [];
  updatedData?.map((item, index) => {
    if (item.includes(null)) {
      mainItems.push(item.replace(null, filteredDataPointsD[index]?.value));
    }
  });
  const xAxis = {
    valueFormatter: !isEmpty(mainItems) ? mainItems : updatedData,
    granularityEnabled: true,
    granularity: 1,
    drawGridLines: true,
    textSize: 8,
    textColor: processColor(darkmode ? BaseColors.white : BaseColors.black),
    radialGridCount: 6,
  };
  const nullToZero = Object?.values(transformedDataCurr);

  nullToZero?.map((item, index) => {
    if (item.value == null) {
      item.value = filteredDataPointsD[index]?.value;
    }
  });

  return (
    <TouchableWithoutFeedback style={styles.container}>
      <RadarChart
        style={styles.chart}
        data={
          initial
            ? {
                dataSets: [
                  {
                    values: filteredDataPointsD,
                    label: 'Initial',
                    config: {
                      drawFilled: true,
                      fillColor: processColor('aqua'),
                      fillAlpha: 100,
                      drawHighlightIndicators: false,
                      valueTextSize: 0,
                      valueTextColor: processColor('transparent'),
                      visible: Platform.OS === 'ios' ? false : true,
                    },
                  },
                ],
              }
            : {
                dataSets: [
                  {
                    values: transformedDataCurr,
                    config: {
                      drawFilled: true,
                      fillColor: processColor('green'),
                      fillAlpha: 100,
                      drawHighlightIndicators: false,
                      valueTextSize: 0,
                      valueTextColor: processColor('transparent'),
                      lineWidth: 1.3,
                      color: processColor('green'),
                    },
                  },
                  {
                    values: transformedDataInit,
                    config: {
                      drawFilled: true,
                      fillColor: processColor('aqua'),
                      drawHighlightIndicators: false,
                      valueTextSize: 0,
                      lineWidth: 1.3,
                      color: processColor('aqua'),
                      valueTextColor: processColor('transparent'),
                    },
                  },
                ],
              }
        }
        xAxis={xAxis}
        yAxis={{
          valueFormatter: [],
          axisMaximum: 6,
          axisMinimum: 0,
          granularity: 1,
          labelCount: 7,
          labelCountForce: true,
        }}
        legend={{ enabled: true }}
        chartDescription={{ text: '' }}
        chartBackgroundColor={0x00ffff}
        webLineWidth={Platform.OS === 'ios' ? 0.2 : 1}
        webColor={processColor(
          darkmode ? BaseColors.white : BaseColors.textGrey,
        )}
        webLineWidthInner={Platform.OS === 'ios' ? 0.2 : 1}
        webColorInner={processColor(
          darkmode ? BaseColors.white : BaseColors.textGrey,
        )}
        webAlpha={80}
        skipWebLineCount={0}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    width: '95%',
    height: 400,
  },
});

export default SpiderWebChart;
