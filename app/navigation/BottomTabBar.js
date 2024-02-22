/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { BaseColors, BaseStyles, FontFamily, Typography } from '@config/theme';
import { useDispatch, useSelector } from 'react-redux';
import {
  Events,
  SvgHomeMenu,
  SvgNotification,
  SvgUser,
} from '@components/SVG_Bundle';
import authActions from '@redux/reducers/auth/actions';
import { AppTourView } from 'imokhles-react-native-app-tour';

export default function BottomTabBar({ state, descriptors, navigation }) {
  const { darkmode, badge } = useSelector(state => {
    return state.auth;
  });
  const totalWidth = Dimensions.get('window').width;
  const tabWidth = totalWidth / state.routes.length;
  const [translateValue] = useState(new Animated.Value(tabWidth * 2 - 7));
  const homeAnimRef = useRef();
  const eventAnimRef = useRef();
  const notifyAnimRef = useRef();
  const profileAnimRef = useRef();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const IOS = Platform.OS === 'ios';

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  /* All events in bottombar are hendle here it means when user change screen it will be store in redux */

  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  let appTourTargets = [];

  const dispatch = useDispatch();
  const { setAppTour } = authActions;
  useEffect(() => {
    if (appTourTargets.length >= 4) {
      dispatch(setAppTour([...appTourTargets]));
    }
  }, [appTourTargets]);

  const getIcons = (label, isFocused, index) => {
    const tabIconColor = isFocused ? BaseColors.primary : BaseColors.msgColor;
    switch (label) {
      case 'HomeStackNavigator':
        return (
          <Animatable.View
            useNativeDriver
            ref={homeAnimRef}
            style={{
              alignItems: 'center',
              marginTop: 3,
            }}
          >
            <SvgHomeMenu
              height={25}
              width={25}
              fill={
                isFocused
                  ? BaseColors.primary
                  : darkmode
                  ? BaseColors.white
                  : BaseColors.msgColor
              }
            />
          </Animatable.View>
        );
      case 'EventsStackNavigator':
        return (
          <Animatable.View
            useNativeDriver
            ref={eventAnimRef}
            style={{
              alignItems: 'center',
              marginTop: 3,
            }}
          >
            <Events
              height={27}
              width={27}
              fill={
                isFocused
                  ? BaseColors.primary
                  : darkmode
                  ? BaseColors.white
                  : BaseColors.msgColor
              }
            />
          </Animatable.View>
        );
      case 'NotificationStackNavigator':
        return (
          <Animatable.View
            useNativeDriver
            ref={notifyAnimRef}
            style={{
              alignItems: 'center',
              marginTop: 7,
            }}
          >
            {badge && (
              <View
                style={{
                  position: 'absolute',
                  height: 7,
                  width: 7,
                  top: 5,
                  borderRadius: 50,
                  right: 5,
                  backgroundColor: BaseColors.primary,
                }}
              />
            )}

            <SvgNotification
              height={25}
              width={25}
              fill={
                isFocused
                  ? BaseColors.primary
                  : darkmode
                  ? BaseColors.white
                  : BaseColors.msgColor
              }
            />
          </Animatable.View>
        );

      case 'ProfileStackNavigator':
        return (
          <Animatable.View
            useNativeDriver
            ref={profileAnimRef}
            style={{
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <SvgUser
              height={25}
              width={25}
              fill={
                isFocused
                  ? BaseColors.primary
                  : darkmode
                  ? BaseColors.white
                  : BaseColors.msgColor
              }
            />
          </Animatable.View>
        );
    }
  };

  const getIconsName = (label, isFocused) => {
    switch (label) {
      case 'HomeStackNavigator':
        return 'Home';
      case 'EventsStackNavigator':
        return 'Event';
      case 'NotificationStackNavigator':
        return 'Notification';
      case 'ProfileStackNavigator':
        return 'Profile';
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        display: isKeyboardOpen && !IOS ? 'none' : null,
      }}
    >
      <Animated.View
        style={[
          styles.slider,
          {
            transform: [
              {
                translateX: translateValue,
              },
            ],
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <View style={styles.roundViewStyle} />
      </Animated.View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          if (index === 0) {
            homeAnimRef.current.zoomIn(300);
          }
          if (index === 1) {
            eventAnimRef.current.zoomIn(300);
          }
          if (index === 2) {
            notifyAnimRef.current.zoomIn(300);
          }
          if (index === 3) {
            profileAnimRef.current.zoomIn(300);
          }
          navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            ref={ref => {
              if (!ref) return;
              if (index === 0) {
                let props = {
                  order: 1,
                  title: `Home`,
                  description: `This is the Home tab icon. When pressed, it navigates to the home screen`,
                };
                appTourTargets.push(
                  AppTourView.for(ref, {
                    ...props,
                    ...Typography.walkThroughStyle,
                  }),
                );
              } else if (index === 1) {
                let props = {
                  order: 2,
                  title: `Events`,
                  description: `This is the Events tab icon. When pressed, it navigates to the events screen`,
                };
                appTourTargets.push(
                  AppTourView.for(ref, {
                    ...props,
                    ...Typography.walkThroughStyle,
                  }),
                );
              } else if (index === 2) {
                let props = {
                  order: 3,
                  title: `Notification`,
                  description: `This is the Notification tab icon. When pressed, it navigates to the notification screen`,
                };
                appTourTargets.push(
                  AppTourView.for(ref, {
                    ...props,
                    ...Typography.walkThroughStyle,
                  }),
                );
              } else if (index === 3) {
                let props = {
                  order: 4,
                  title: `Profile`,
                  description: `his is the Profile tab icon. When pressed, it navigates to the user profile screen`,
                };
                appTourTargets.push(
                  AppTourView.for(ref, {
                    ...props,
                    ...Typography.walkThroughStyle,
                  }),
                );
              }
            }}
            style={{
              flex: 1,
              paddingBottom: IOS ? 20 : 10,
              FontFamily: FontFamily.bold,
              height: IOS ? 80 : 70,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: darkmode
                ? BaseColors.lightBlack
                : BaseColors.white,
              borderTopColor: BaseColors.borderColor,
              paddingTop: 5,
              borderTopWidth: 0.5,
              zIndex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: darkmode
                  ? BaseColors.lightBlack
                  : BaseColors.white,
              }}
            >
              {getIcons(label, isFocused, index)}
            </View>
            <Text
              style={{
                color: isFocused
                  ? BaseColors.primary
                  : darkmode
                  ? BaseColors.white
                  : BaseColors.msgColor,
                fontFamily: FontFamily.bold,
                fontSize: 11,
                marginVertical: 3,
              }}
            >
              {getIconsName(label, isFocused)}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.last} />
    </View>
  );
}
const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    backgroundColor: BaseColors.whiteSmoke,
    textAlign: 'center',
    ...BaseStyles.shadow,
  },
  walkThroughStyle: {
    titleTextSize: 20,
    descriptionTextSize: 12,
    titleTextColor: BaseColors.red,
    descriptionTextColor: BaseColors.red,
    fontFamily: FontFamily.semibold,
    outerCircleColor: BaseColors.primaryLight,
    // cancelable: false,  // uncomment this if you want to add only close when user click in circle
    targetCircleColor: BaseColors.red,
  },
  iconContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabName: {
    color: BaseColors.backRed,
    fontSize: 15,
  },
  last: {
    zIndex: 0,
    position: 'absolute',
    bottom: 0,
  },
});
