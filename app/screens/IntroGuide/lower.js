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
  SvgHomeMenu,
  Events,
  SvgNotification,
  SvgUser,
} from '@components/SVG_Bundle';
import Button from '@components/Button';

const Lower = ({ navigation }) => {
  const boxHeight = useSharedValue(400);

  const [home, setHome] = useState(true);
  const [event, setEvent] = useState(false);
  const [notify, setNotify] = useState(false);
  const [profile, setProfile] = useState(false);
  const [baseLine, setBaseLine] = useState(false);

  const scaleHome = useSharedValue(0);
  const scaleEvents = useSharedValue(0);
  const scaleNotification = useSharedValue(0);
  const scaleProfile = useSharedValue(0);
  const scaleBaseLine = useSharedValue(0);
  const boxScale = useSharedValue(1);

  const rightRadius = useSharedValue(600);
  const leftRadius = useSharedValue(0);

  const textHome = useSharedValue(0);
  const textEvents = useSharedValue(0);
  const textNotify = useSharedValue(0);
  const textProfile = useSharedValue(0);
  const textBaseLine = useSharedValue(0);

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
      borderTopRightRadius: rightRadius.value,
      borderTopLeftRadius: leftRadius.value,
      height: boxHeight.value,
      transform: [{ scale: boxScale.value }],
    };
  });
  const AnimBaseLine = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleBaseLine.value }],
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
  const animTextBaseLine = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textBaseLine.value }],
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

    if (baseLine) {
      const intervalId = setInterval(() => {
        scaleBaseLine.value = withSpring(scaleBaseLine.value === 1 ? 1.1 : 1);
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [home, profile, event, notify, baseLine]);

  // step handlers
  const handleHome = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      boxHeight.value = withSpring(400);
    }, 200);
    scaleHome.value = withSpring(0);
    scaleEvents.value = withSpring(1);
    setHome(false);
    setEvent(true);
    textHome.value = withTiming(0, { duration: 500 });

    setTimeout(() => {
      textEvents.value = withTiming(1, { duration: 500 });
    }, 500);
  };
  const handleEvents = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      boxHeight.value = withSpring(400);
    }, 200);
    scaleEvents.value = withSpring(0);
    scaleNotification.value = withSpring(1);
    setEvent(false);
    setNotify(true);
    rightRadius.value = withSpring(0);
    leftRadius.value = withSpring(600);
    textEvents.value = withTiming(0, { duration: 500 });

    setTimeout(() => {
      textNotify.value = withTiming(1, { duration: 500 });
    }, 500);
  };
  const handleNotification = () => {
    boxHeight.value = withTiming(0, { duration: 100 });
    setTimeout(() => {
      boxHeight.value = withSpring(400);
    }, 200);
    scaleNotification.value = withSpring(0);
    scaleProfile.value = withSpring(1);
    setNotify(false);
    setProfile(true);
    textNotify.value = withTiming(0, { duration: 500 });
    setTimeout(() => {
      textProfile.value = withTiming(1, { duration: 500 });
    }, 500);
  };
  const handleProfile = () => {
    scaleProfile.value = withSpring(0);
    setProfile(false);

    textProfile.value = withTiming(0, { duration: 500 });
    rightRadius.value = withSpring(20);
    leftRadius.value = withSpring(20);
    boxHeight.value = withTiming(0);

    setTimeout(() => {
      boxHeight.value = withTiming(280, { duration: 300 });
    }, 300);

    setTimeout(() => {
      scaleBaseLine.value = withSpring(1);
      setBaseLine(true);
    }, 700);
    setTimeout(() => {
      textBaseLine.value = withTiming(1, { duration: 500 });
    }, 500);
  };

  const baselineClick = () => {
    boxHeight.value = withTiming(0);
    navigation.goBack();
    setTimeout(() => {
      navigation.navigate('Upper');
    }, 100);
  };

  const Description = ({ type }) => {
    console.log(type);
    return (
      <View style={{ marginTop: 8 }}>
        <Text
          style={{
            color: BaseColors.white,
            textAlign: type === 'baseline' ? 'center' : 'auto',
          }}
        >
          Lorem Ipsum is simply dummy text
        </Text>
        <Text
          style={{
            color: BaseColors.white,
            textAlign: type === 'baseline' ? 'center' : 'auto',
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
          <Text style={styles.topTitle}>HOME</Text>
          <Description />
        </Animated.View>
        <Animated.View style={[styles.roundHome, AnimHome]}>
          <TouchableOpacity onPress={() => handleHome()}>
            <SvgHomeMenu height={35} width={35} fill={BaseColors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Events */}
        <Animated.View style={[styles.firstTwo, animTextEvent]}>
          <Text style={styles.topTitle}>EVENTS</Text>
          <Description />
        </Animated.View>
        <Animated.View style={[styles.roundEvents, AnimEvents]}>
          <TouchableOpacity onPress={() => handleEvents()}>
            <Events height={60} width={60} fill={BaseColors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Notification */}
        <Animated.View style={[styles.lastTwo, animTextNotify]}>
          <Text style={styles.topTitle}>NOTIFICATIONS</Text>
          <Description />
        </Animated.View>
        <Animated.View style={[styles.roundNotification, AnimNotification]}>
          <TouchableOpacity onPress={() => handleNotification()}>
            <SvgNotification height={35} width={35} selected={true} />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile */}
        <Animated.View style={[styles.lastTwo, animTextProfile]}>
          <Text style={styles.topTitle}>PROFILE</Text>
          <Description />
        </Animated.View>
        <Animated.View style={[styles.roundProfile, AnimProfile]}>
          <TouchableOpacity onPress={() => handleProfile()}>
            <SvgUser height={35} width={35} fill={BaseColors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* BaseLine */}
        <Animated.View style={[styles.base, animTextBaseLine]}>
          <Text style={styles.topTitle}>BaseLine</Text>
          <Description type={'baseline'} />
        </Animated.View>
        <Animated.View style={[styles.baseButton, AnimBaseLine]}>
          <TouchableOpacity
          // onPress={() => handleBaseline()}
          >
            <Button
              style={{ borderRadius: 50 }}
              onPress={() => baselineClick()}
              title="Request Another Baseline"
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Lower;

const baseElementStyles = {
  height: 80,
  width: 80,
  backgroundColor: 'white',
  borderRadius: 40,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 10,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  main: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: BaseColors.primary,
  },
  roundHome: {
    ...baseElementStyles,
    left: BaseSetting.nWidth / 25,
  },
  roundEvents: {
    ...baseElementStyles,
    left: BaseSetting.nWidth / 3.55,
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
  firstTwo: { position: 'absolute', top: 180, left: 10 },
  lastTwo: { position: 'absolute', top: 180, right: 40 },
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
});
