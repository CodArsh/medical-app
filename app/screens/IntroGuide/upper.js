import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BaseColors } from '@config/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import BaseSetting from '@config/setting';
import {
  IntenseSVG,
  LightSVG,
  ModerateSVG,
  RelativeSVG,
  ReturnSVG,
  SymptomSVG,
} from '@components/SVG_Bundle';

const Upper = ({ navigation }) => {
  // RTA counter
  const [count, setCount] = useState(1);
  const [rtaValue, setRtaValue] = useState('');
  useEffect(() => {
    if (count === 1) {
      setRtaValue('Relative Rest');
    } else if (count === 2) {
      setRtaValue('Symptom Limited Activity');
    } else if (count === 3) {
      setRtaValue('Light Activity');
    } else if (count === 4) {
      setRtaValue('Moderate Activity');
    } else if (count === 5) {
      setRtaValue('Intense Activity');
    } else if (count === 6) {
      setRtaValue('Return to Activity');
    }
    // reset counter
    if (count >= 7) {
      handleRTA();
    }
  }, [count]);

  const boxHeight = useSharedValue(180);

  const [home, setHome] = useState(true);
  const [event, setEvent] = useState(false);
  const [notify, setNotify] = useState(false);
  const [profile, setProfile] = useState(false);

  const scaleHome = useSharedValue(0);
  const scaleEvents = useSharedValue(0);
  const scaleNotification = useSharedValue(0);
  const scaleProfile = useSharedValue(0);
  const boxScale = useSharedValue(1);

  const rightRadius = useSharedValue(600);
  const leftRadius = useSharedValue(0);

  const textHome = useSharedValue(0);
  const textEvents = useSharedValue(0);
  const textNotify = useSharedValue(0);
  const textProfile = useSharedValue(0);

  // SCALE POPUP ANIMATION
  const AnimHome = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleHome.value }],
    };
  });
  const AnimEvents = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleEvents.value }],
    };
  });
  const AnimNotification = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleNotification.value }],
    };
  });
  const AnimProfile = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleProfile.value }],
    };
  });

  const animLayer = useAnimatedStyle(() => {
    return {
      borderBottomRightRadius: rightRadius.value,
      borderBottomLeftRadius: leftRadius.value,
      height: boxHeight.value,
      transform: [{ scale: boxScale.value }],
    };
  });

  // ANIMATIONS FOR TEXT
  const animTextHome = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textHome.value }],
    };
  });
  const animTextEvent = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textEvents.value }],
    };
  });
  const animTextNotify = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textNotify.value }],
    };
  });
  const animTextProfile = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textProfile.value }],
    };
  });

  useEffect(() => {
    setTimeout(() => {
      if (!scaleHome.value) {
        scaleHome.value = withSpring(1);
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (home) {
      const intervalId = setInterval(() => {
        scaleHome.value = withSpring(scaleHome.value === 1 ? 1.2 : 1);
      }, 100);

      setTimeout(() => {
        textHome.value = withTiming(1, { duration: 500 });
      }, 500);
      return () => clearInterval(intervalId);
    }

    if (event) {
      const intervalId = setInterval(() => {
        scaleEvents.value = withSpring(scaleEvents.value === 1 ? 1.2 : 1);
      }, 100);

      return () => clearInterval(intervalId);
    }

    if (notify) {
      const intervalId = setInterval(() => {
        scaleNotification.value = withSpring(
          scaleNotification.value === 1 ? 1.2 : 1,
        );
      }, 100);

      return () => clearInterval(intervalId);
    }

    if (profile) {
      const intervalId = setInterval(() => {
        scaleProfile.value = withSpring(scaleProfile.value === 1 ? 1.2 : 1);
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [home, event, notify, profile]);

  // step handlers
  const handleSummary = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      boxHeight.value = withSpring(180);
    }, 200);
    rightRadius.value = withSpring(0);
    leftRadius.value = withSpring(600);
    scaleHome.value = 0;
    scaleEvents.value = withSpring(1);
    setHome(false);
    setEvent(true);
    textHome.value = withTiming(0, { duration: 500 });

    setTimeout(() => {
      textEvents.value = withTiming(1, { duration: 500 });
    }, 500);
  };

  const handleDetails = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      boxHeight.value = withSpring(180);
    }, 200);
    rightRadius.value = withSpring(0);
    leftRadius.value = withSpring(600);
    scaleEvents.value = 0;
    scaleNotification.value = withSpring(1);
    setEvent(false);
    setNotify(true);
    textEvents.value = withTiming(0, { duration: 500 });
    setTimeout(() => {
      textNotify.value = withTiming(1, { duration: 500 });
    }, 500);
  };

  const handleRTA = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      boxHeight.value = withSpring(180);
    }, 200);
    rightRadius.value = withSpring(600);
    leftRadius.value = withSpring(0);
    scaleNotification.value = 0;
    scaleProfile.value = withSpring(1);
    textNotify.value = withTiming(0, { duration: 500 });
    setTimeout(() => {
      textProfile.value = withTiming(1, { duration: 500 });
    }, 500);
    setNotify(false);
    setProfile(true);
  };
  const handleLast = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setProfile(false);
    scaleProfile.value = 0;
    textProfile.value = withTiming(0, { duration: 500 });
    navigation.goBack();
  };

  const Description = ({ type }) => {
    return (
      <View
        style={{
          marginTop: type === 'name' ? 40 : 0,
          marginLeft: type === 'name' ? 5 : 0,
        }}
      >
        <Text
          style={{
            color: BaseColors.white,

            alignSelf: type === 'details' ? 'flex-end' : 'auto',
            paddingLeft: type === 'details' ? BaseSetting.nWidth / 2.8 : 0,
          }}
        >
          Lorem Ipsum is simply dummy text
        </Text>
        <Text
          style={{
            color: BaseColors.white,
            alignSelf: type === 'details' ? 'flex-end' : 'auto',
          }}
        >
          of the printing and typesetting industry.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.main, animLayer]}>
        {/* Home */}
        <Animated.View style={[styles.firstTwo, animTextHome]}>
          <Description />
        </Animated.View>
        <Animated.View style={[styles.roundHome, AnimHome]}>
          <TouchableOpacity
            style={[styles.buttonClick, styles.tabClick]}
            onPress={() => handleSummary()}
          >
            <Text style={styles.tabText}>Summary</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Events */}
        <Animated.View style={[styles.firstTwo, animTextEvent]}>
          <Description type={'details'} />
        </Animated.View>
        <Animated.View style={[styles.roundEvents, AnimEvents]}>
          <TouchableOpacity
            style={[styles.buttonClick, styles.tabClick]}
            onPress={() => handleDetails()}
          >
            <Text style={styles.tabText}>Details</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* RTA */}
        <Animated.View style={[styles.lastTwo, animTextNotify]}>
          <Description />
          <View style={styles.twoBtns}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => handleRTA()}
            >
              <Text style={{ color: BaseColors.white }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setCount(count + 1)}
            >
              <Text>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={[styles.roundNotify, AnimNotification]}>
          <TouchableOpacity
            style={styles.buttonClick}
            onPress={() => handleRTA()}
          >
            <View style={styles.rtaMain}>
              <View style={styles.rtaInside}>
                {count === 1 ? (
                  <RelativeSVG />
                ) : count === 2 ? (
                  <SymptomSVG />
                ) : count === 3 ? (
                  <LightSVG />
                ) : count === 4 ? (
                  <ModerateSVG />
                ) : count === 5 ? (
                  <IntenseSVG />
                ) : (
                  <ReturnSVG />
                )}
              </View>
              <View style={{ width: '70%' }}>
                <Text style={styles.stage}>RTA Stages</Text>
                <Text style={{ fontSize: 11 }}>{rtaValue}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* NAME */}
        <Animated.View style={[styles.firstTwo, animTextProfile]}>
          <Description type={'name'} />
        </Animated.View>
        <Animated.View style={[styles.roundName, AnimProfile]}>
          <TouchableOpacity
            style={styles.buttonClick}
            onPress={() => handleLast()}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Welcome</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Upper;

const baseElementStyles = {
  height: 45,
  width: 180,
  backgroundColor: 'white',
  borderRadius: 4,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 20,
  // elevation: 5,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  main: {
    position: 'absolute',
    width: '100%',
    // bottom: 0,
    backgroundColor: BaseColors.primary,
  },
  roundHome: {
    ...baseElementStyles,
    left: BaseSetting.nWidth / 25,
  },
  roundEvents: {
    ...baseElementStyles,
    left: BaseSetting.nWidth / 2,
  },
  roundNotify: {
    ...baseElementStyles,
    top: 25,
    left: BaseSetting.nWidth / 2,
  },
  roundName: {
    ...baseElementStyles,
    top: 25,
    left: 15,
  },
  roundNotification: {
    ...baseElementStyles,
    left: BaseSetting.nWidth / 1.9,
  },
  roundProfile: {
    ...baseElementStyles,
    left: BaseSetting.nWidth / 1.3,
  },
  topTitle: {
    color: BaseColors.white,
    fontWeight: 'bold',
    fontSize: 20,
    borderBottomWidth: 1,
    marginBottom: 1,
    borderColor: BaseColors.white,
    alignSelf: 'center',
  },
  firstTwo: { position: 'absolute', top: 50, left: 10 },
  lastTwo: {
    position: 'absolute',
    top: 100,
    right: 10,
  },
  base: {
    textAlign: 'center',
    marginTop: BaseSetting.nHeight / 20,
    marginBottom: 15,
  },
  baseButton: {
    marginTop: 15,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: BaseColors.white,
    borderRadius: 50,
  },
  buttonClick: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  tabClick: {
    borderBottomWidth: 5,
    borderColor: BaseColors.secondary,
  },
  tabText: {
    fontSize: 18,
    color: BaseColors.secondary,
  },
  twoBtns: {
    position: 'absolute',
    right: 15,
    top: BaseSetting.nHeight / 16,
    flexDirection: 'row',
    minWidth: 150,
    justifyContent: 'space-evenly',
  },
  skipBtn: {
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: BaseColors.white,
  },
  nextBtn: {
    backgroundColor: BaseColors.white,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  rtaMain: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rtaInside: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  stage: {
    fontSize: 13,
    color: BaseColors.primary,
    fontWeight: '700',
  },
});
