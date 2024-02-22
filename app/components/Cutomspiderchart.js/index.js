import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Svg, Path, Circle, Polygon } from 'react-native-svg';
import { BaseColors } from '@config/theme';
import DeviceInfo from 'react-native-device-info';
import {
  NeckPain,
  Nausea,
  Headache,
  PressureinHead,
  Dizziness,
  BlurredVision,
  BalanceProblems,
  SensitivitytoLight,
  SensitivitytoNoise,
  FeelingSlowedDown,
  Feelinginafog,
  DontFeelRight,
  DifficultyConcentrating,
  DifficultyRemembering,
  Fatigue,
  Confusion,
  Drowsiness,
  Moreemotional,
  Irritability,
  Sadness,
  Nervousness_Anxiousness,
  TroubleFallingAsleep,
} from '@components/SVG_Bundle';
import { useSelector } from 'react-redux';
import BaseSetting from '@config/setting';

const Cutomspiderchart = ({ data, size, axesSvg }) => {
  const { darkmode } = useSelector(state => state.auth);

  // Create a mapping of event names to SVG components
  const eventToSVGComponent = {
    headache: <Headache height={15} width={15} />,
    press_head: <PressureinHead height={15} width={15} />,
    neck_pain: <NeckPain height={15} width={15} />,
    nausea: <Nausea height={15} width={15} />,
    dizziness: <Dizziness height={15} width={15} />,
    vis_prob: <BlurredVision height={15} width={15} />,
    balance: <BalanceProblems height={15} width={15} />,
    sens_light: <SensitivitytoLight height={15} width={15} />,
    sens_noise: <SensitivitytoNoise height={15} width={15} />,
    slow: <FeelingSlowedDown height={15} width={15} />,
    foggy: <Feelinginafog height={15} width={15} />,
    not_right: <DontFeelRight height={15} width={15} />,
    diff_concen: <DifficultyConcentrating height={15} width={15} />,
    diff_rem: <DifficultyRemembering height={15} width={15} />,
    fatigue: <Fatigue height={15} width={15} />,
    confused: <Confusion height={15} width={15} />,
    drowsy: <Drowsiness height={15} width={15} />,
    emotional: <Moreemotional height={15} width={15} />,
    irritable: <Irritability height={15} width={15} />,
    sad_dep: <Sadness height={15} width={15} />,
    nerv_anx: <Nervousness_Anxiousness height={15} width={15} />,
    trouble_sleep: <TroubleFallingAsleep height={15} width={15} />,
  };

  // Create a mapping of event names to descriptions
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
  const numDataPoints = data.length;
  const anglePerDataPoint = data.length === 2 ? 120 : 360 / numDataPoints;
  const maxDataValue = 0.6;
  const isTab = DeviceInfo.isTablet();
  const fixedDistanceFromCenter = isTab ? size / 5 : size / 6;

  // Define the values you want to ensure are drawn
  const targetValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  const numAxes =
    numDataPoints === 5
      ? 5
      : numDataPoints === 3
      ? 3
      : numDataPoints === 1 || numDataPoints === 2
      ? 3
      : numDataPoints;

  const anglePerAxis = 360 / numAxes;
  const centerPolygonVerticess = Array.from({ length: 3 }).map((_, i) => {
    const angleVertex = ((360 / 3) * i) % 360;
    const radius = 0.03; // Adjust this value to change the size of the polygon
    const x =
      size / 2 + (radius * Math.cos((angleVertex * Math.PI) / 180) * size) / 3;
    const y =
      size / 2 + (radius * Math.sin((angleVertex * Math.PI) / 180) * size) / 3;
    return `${x},${y}`;
  });

  // Calculate the vertices for the center polygon based on the number of data points
  const centerPolygonVertices = Array.from({ length: numDataPoints }).map(
    (_, i) => {
      const angleVertex = ((360 / numDataPoints) * i) % 360;
      const radius = 0.03; // Adjust this value to change the size of the polygon
      const x =
        size / 2 +
        (radius * Math.cos((angleVertex * Math.PI) / 180) * size) / 3;
      const y =
        size / 2 +
        (radius * Math.sin((angleVertex * Math.PI) / 180) * size) / 3;
      return `${x},${y}`;
    },
  );

  // Function to calculate axis coordinates
  const calculateAxisCoordinates = angle => {
    const x1 = size / 2;
    const y1 = size / 2;
    const x2 = size / 2 + (Math.cos((angle * Math.PI) / 180) * size) / 7.8;
    const y2 = size / 2 + (Math.sin((angle * Math.PI) / 180) * size) / 7.8;
    return { x1, y1, x2, y2 };
  };

  return (
    <View
      style={{
        width: BaseSetting.nWidth,
      }}
    >
      <Svg
        width={600}
        height={600}
        style={{
          fill: darkmode ? BaseColors.white : BaseColors.textColor,
          marginLeft:
            Platform.OS === 'ios'
              ? BaseSetting.nWidth / -1.89
              : BaseSetting.nWidth / -1.75,
          marginTop: -200,
        }}
      >
        {/* Draw axes */}
        {Array.from({ length: numAxes }).map((_, index) => {
          const angle = index * anglePerAxis;
          const { x1, y1, x2, y2 } = calculateAxisCoordinates(angle);

          return (
            <Path
              style={{
                fill: darkmode ? BaseColors.white : BaseColors.textColor,
              }}
              key={`axis-${index}`}
              d={`M ${x1} ${y1} L ${x2} ${y2}`}
              stroke={darkmode ? BaseColors.white : BaseColors.black20}
              strokeWidth={axesSvg.strokeWidth}
            />
          );
        })}
        {/* Draw data value range lines and circles */}
        {data.map((dataPoint, index) => {
          const angle = index * anglePerDataPoint;
          const value = dataPoint.curr_value * 0.1 * maxDataValue;

          const initialValue = dataPoint.initial_value * 0.1 * maxDataValue;

          const x =
            size / 2 + (value * Math.cos((angle * Math.PI) / 180) * size) / 3;
          const y =
            size / 2 + (value * Math.sin((angle * Math.PI) / 180) * size) / 3;

          const initialX =
            size / 2 +
            (initialValue * Math.cos((angle * Math.PI) / 180) * size) / 3;
          const initialY =
            size / 2 +
            (initialValue * Math.sin((angle * Math.PI) / 180) * size) / 3;

          const iconX =
            size / 2 +
            fixedDistanceFromCenter * Math.cos((angle * Math.PI) / 180);
          const iconY =
            size / 2 +
            fixedDistanceFromCenter * Math.sin((angle * Math.PI) / 180);
          const duplicatedData =
            data.length <= 2 ? [...data, ...data.slice(0, 2)] : data;
          const referenceValue = 0.001;
          const referenceX =
            size / 2 +
            (referenceValue *
              Math.cos((anglePerDataPoint * Math.PI) / 180) *
              size) /
              3;
          const referenceY =
            size / 2 +
            (referenceValue *
              Math.sin((anglePerDataPoint * Math.PI) / 180) *
              size) /
              3;
          return (
            <View key={`data-point-${index}`} style={{ position: 'absolute' }}>
              <Svg height={600} width={600}>
                {data.length === 2 && (
                  <Polygon
                    points={data
                      .map((dataPoint, index) => {
                        const angle = index * anglePerDataPoint;
                        const value = dataPoint.curr_value * 0.1 * maxDataValue;
                        const x =
                          size / 2 +
                          (value * Math.cos((angle * Math.PI) / 180) * size) /
                            3;
                        const y =
                          size / 2 +
                          (value * Math.sin((angle * Math.PI) / 180) * size) /
                            3;
                        return `${x},${y}`;
                      })
                      .concat(`${referenceX},${referenceY}`) // Add the reference point
                      .join(' ')}
                    fill={'#7DD4C6'}
                    fillOpacity={0.3}
                    stroke={'#53c68c'}
                    strokeWidth={2}
                  />
                )}
                {data.length === 2 && (
                  <Polygon
                    points={data
                      .map((dataPoint, index) => {
                        const angle = index * anglePerDataPoint;
                        const value =
                          dataPoint.initial_value * 0.1 * maxDataValue;
                        const x =
                          size / 2 +
                          (value * Math.cos((angle * Math.PI) / 180) * size) /
                            3;
                        const y =
                          size / 2 +
                          (value * Math.sin((angle * Math.PI) / 180) * size) /
                            3;
                        return `${x},${y}`;
                      })
                      .concat(`${referenceX},${referenceY}`) // Add the reference point
                      .join(' ')}
                    fill={'#66b3ff'}
                    fillOpacity={0.3}
                    stroke={'#66b3ff'}
                    strokeWidth={2}
                  />
                )}
                <Polygon
                  points={data
                    .map((dataPoint, index) => {
                      const angle = index * anglePerDataPoint;
                      const value = dataPoint.curr_value * 0.1 * maxDataValue;
                      const x =
                        size / 2 +
                        (value * Math.cos((angle * Math.PI) / 180) * size) / 3;
                      const y =
                        size / 2 +
                        (value * Math.sin((angle * Math.PI) / 180) * size) / 3;
                      return `${x},${y}`;
                    })

                    .join(' ')}
                  fill={'#7DD4C6'}
                  fillOpacity={0.1}
                  stroke={'#53c68c'}
                  strokeWidth={2}
                />

                <Polygon
                  points={data
                    .map((dataPoint, index) => {
                      const angle = index * anglePerDataPoint;
                      const value =
                        dataPoint.initial_value * 0.1 * maxDataValue;
                      const x =
                        size / 2 +
                        (value * Math.cos((angle * Math.PI) / 180) * size) / 3;
                      const y =
                        size / 2 +
                        (value * Math.sin((angle * Math.PI) / 180) * size) / 3;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill={'#66b3ff'}
                  fillOpacity={0.1}
                  stroke={'#66b3ff'}
                  strokeWidth={2}
                />

                {/* Draw data point value range lines */}
                <Path
                  key={`range-line-${index}`}
                  d={`M ${size / 2} ${size / 2} L ${x} ${y}`}
                  stroke={
                    data.length === 1 ? '#7DD4C6' : BaseColors.transparent
                  }
                  strokeWidth={8}
                  fillOpacity={0.1}
                />

                {/* Draw initial data point value range lines */}
                <Path
                  key={`initial-range-line-${index}`}
                  d={`M ${size / 2} ${size / 2} L ${initialX} ${initialY}`}
                  stroke={
                    data.length === 1 ? '#99d6ff' : BaseColors.transparent
                  }
                  strokeWidth={8}
                  fillOpacity={0.05}
                />
              </Svg>
              <View
                style={{
                  position: 'absolute',
                  top: iconY - 35,
                  left: iconX - 15,
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ borderWidth: 1, borderColor: 'transparent' }}>
                  {eventToSVGComponent[dataPoint.label]}
                </View>

                <Text style={{ fontSize: 14, color: BaseColors.primary }}>
                  {Math.round(dataPoint.curr_value)}
                </Text>
              </View>

              <Text
                style={{
                  position: 'absolute',
                  top: iconY + -10,
                  left: iconX - 30,
                  fontSize: 10,
                  textAlign: 'center',
                  width: 65,
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                  whiteSpace: 'nowrap', // Add this style to prevent text wrapping
                }}
              >
                {eventDescriptions[dataPoint.label]}
              </Text>
            </View>
          );
        })}
        {/* Draw filled circle at the center representing zero */}
        {data.length === 1 && (
          <Polygon
            points={centerPolygonVerticess.join(' ')}
            fill={'#99d6ff'} // Choose the desired fill color
            stroke={darkmode ? BaseColors.white : BaseColors.black20}
            fillOpacity={0.9}
            strokeWidth={1.5}
          />
        )}
        {data.length === 2 && (
          <Polygon
            points={centerPolygonVerticess.join(' ')}
            fill={'#66b3ff'} // Choose the desired fill color
            stroke={darkmode ? BaseColors.white : BaseColors.black20}
            fillOpacity={0.5}
            strokeWidth={1.5}
          />
        )}
        {/* Draw a filled polygon at the center representing zero */}
        <Polygon
          points={centerPolygonVertices.join(' ')}
          fill={'#66b3ff'} // Choose the desired fill color
          fillOpacity={0.3}
          stroke={darkmode ? BaseColors.white : BaseColors.black20}
          strokeWidth={1.5}
        />

        {/* Draw dodecagon for target value */}
        {targetValues.map((targetValue, index) => {
          const angle = index * anglePerDataPoint;
          const value = targetValue * maxDataValue;

          // Determine the number of sides based on data.length
          const numSides = data.length;

          // Calculate polygon vertices
          const vertices = Array.from({ length: numAxes }).map((_, i) => {
            const angleVertex = ((360 / numAxes) * i + angle) % 360;
            const x =
              size / 2 +
              (value * Math.cos((angleVertex * Math.PI) / 180) * size) / 3;
            const y =
              size / 2 +
              (value * Math.sin((angleVertex * Math.PI) / 180) * size) / 3;
            return `${x},${y}`;
          });

          return (
            <View
              key={`target-polygon-${index}`}
              style={{ position: 'absolute' }}
            >
              <Svg height={600} width={600}>
                <Polygon
                  points={vertices.join(' ')}
                  fill="transparent"
                  stroke={darkmode ? BaseColors.white : BaseColors.black20}
                  strokeWidth={2}
                />
              </Svg>
            </View>
          );
        })}
      </Svg>
    </View>
  );
};
export default Cutomspiderchart;
