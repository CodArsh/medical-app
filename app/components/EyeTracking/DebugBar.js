import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import Animated, {
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import EyeTracking from '@redux/reducers/eyeTracking/actions';
import { formatObjectValues } from '@utils/eyeTracking';
import { useDispatch, useSelector } from 'react-redux';

const ACTION_BTN_WIDTH = Dimensions.get('window').width - 60;
const screenHeight = Dimensions.get('window').height;

export default function DebugBar(props) {
  const [isHidden, setIsHidden] = useState(true);
  const offset = useSharedValue(-ACTION_BTN_WIDTH); // animation value
  const keyboardOffset = useSharedValue(0); // animation value

  const dispatch = useDispatch();
  const { setCalTime } = EyeTracking;
  const { calibrationTime } = useSelector(state => {
    return state.eyeTracking;
  });
  const [textInputValue, setTextInputValue] = useState(calibrationTime);
  const onTextInputChange = text => {
    // setTextInputValue(calibrationTime);
    dispatch(setCalTime(text));
  };

  // Update textInputValue whenever calibrationTime changes
  useEffect(() => {
    setTextInputValue(calibrationTime);
  }, [calibrationTime]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value },
        { translateY: keyboardOffset.value },
      ],
    };
  });

  const hideBar = () => {
    offset.value = withTiming(-ACTION_BTN_WIDTH); // assume the width of the debug bar is 250
    setIsHidden(true);
  };

  const showBar = () => {
    offset.value = withTiming(0);
    setIsHidden(false);
  };

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      'keyboardWillShow',
      event => {
        const keyboardHeight = screenHeight - event.endCoordinates.screenY;
        keyboardOffset.value = withTiming(-keyboardHeight);
      },
    );

    const keyboardHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        keyboardOffset.value = withTiming(0);
      },
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardOffset]);

  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={[styles.debugBar, animatedStyle]}
    >
      <ScrollView style={styles.infoScroll}>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.dlabel}>Light</Text>
            <Text style={styles.dvalue}>
              {props.debugData.light ? props.debugData.light.toFixed(4) : '-'}
            </Text>
          </View>
          <View>
            <Text style={styles.dlabel}>Face Rot</Text>
            <Text style={styles.dvalue}>
              {formatObjectValues(props.debugData.faceRotation) || '-'}
            </Text>
          </View>
          <View>
            <Text style={styles.dlabel}>Device Rot</Text>
            <Text style={styles.dvalue}>
              {formatObjectValues(props.debugData.deviceRotation) || '-'}
            </Text>
          </View>
          <View>
            <Text style={styles.dlabel}>Face Dist</Text>
            <Text style={styles.dvalue}>
              {props.debugData.rightEyeDistance
                ? props.debugData.rightEyeDistance.toFixed(4)
                : '-'}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.dlabel}>Last Updated</Text>
            <Text style={styles.dvalue}>
              {props.debugData.timestamp || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.dlabel}>Calibration Time ( in MS. )</Text>
            {/* <Text style={styles.dvalue}>{props.calibration_time || '-'}</Text> */}
            <TextInput
              placeholder="Calibration Time"
              value={textInputValue}
              onChangeText={onTextInputChange}
              // inputMode="numeric"
              keyboardType="decimal-pad"
              returnKeyType="done"
              style={{
                borderWidth: 1,
                borderColor: '#000',
                fontSize: 16,
                borderRadius: 10,
                marginLeft: 10,
                width: 80,
                padding: 4,
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.dActions}>
        <TouchableOpacity onPress={isHidden ? showBar : hideBar}>
          <Text style={[styles.dvalue, styles.actionHide]}>
            {isHidden ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
