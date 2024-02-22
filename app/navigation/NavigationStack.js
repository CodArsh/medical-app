import React, { useState, useMemo, useReducer, useEffect } from 'react';
import { AppState, Platform, Text, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EventRegister } from 'react-native-event-listeners';
import SplashScreen from '@screens/SplashScreen';
import { NotificationContext } from '@components';
import notificationReducer from '@redux/reducers/notificationReducer';
import { store } from '@redux/store/configureStore';
import AuthAction from '@redux/reducers/auth/actions';
import { BaseColors, DarkBaseColor } from '@config/theme';
import { navigationRef } from './NavigationService';
import Home from '@screens/Home';
import Events from '@screens/Events';
import Notification from '@screens/Notification';
import Profile from '@screens/Profile';
import BottomTabBar from './BottomTabBar';
import Login from '@screens/Login';
import ResetPassword from '@screens/ResetPassword';
import ForgetPassword from '@screens/ForgetPassword';
import OTP from '@screens/OTP';
import EventDetails from '@screens/EventDetails';
import Dashboard from '@screens/Dashboard';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import TermsofServices from '@screens/TermsofServices';
import NotificationSettings from '@screens/NotificationSettings';
import Callibration from '@screens/Callibration';
import CallibrationStart from '@screens/Callibration/start';
import Symptoms from '@screens/Symptoms';
import Assessment from '@screens/Assessment';
import ChangeInfo from '@screens/ChangeInfo';
import ImmediateRecall from '@screens/ImmediateRecall';
import TwofactorEnabled from '@screens/TwofactorEnabled';
import VoiceInput from '@screens/VoiceInput';
import Wordlist from '@screens/Wordlist';
import DigitalRecall from '@screens/DigitalRecall';
import Recalldigits from '@screens/Recalldigits';
import FaceidEnabled from '@screens/FaceidEnabled';
import ImmediateRecallmain from '@screens/ImmediateRecallmain';
import Comment from '@screens/Comment';
import AuthenticationFactor from '@screens/Authentication';
import Symptom from '@screens/Symptom';
import Instructions from '@screens/Callibration/instructions';
import Success from '@screens/Callibration/success';
import _, { isEmpty, isObject } from 'lodash';
import moment from 'moment';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import messaging from '@react-native-firebase/messaging';
import InsideNotification from '@screens/InsideNotification';
import ExampleRadarChart from '@screens/Extra.js';
import Upper from '@screens/IntroGuide/upper';
import Lower from '@screens/IntroGuide/lower';
import RemotePushController from '@components/NotificationConfig/RemotePushController';

const intitialNotificationState = {
  notification: null,
  openedNotification: null,
  countOfNotification: 0,
};
const IOS = Platform.OS === 'ios';

// Remove font scale
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
// DatePicker.defaultProps = DatePicker.defaultProps || {};
// DatePicker.defaultProps.allowFontScaling = false;

function App() {
  const dispatch = useDispatch();
  const {
    setBaseColor,
    setDarkmode,
    setUserData,
    setRefreshTokenExpire,
    setAccessToken,
    setBadge,
  } = AuthAction;

  const [Notifystate, dispatchState] = useReducer(
    notificationReducer,
    intitialNotificationState,
  );
  const notiValue = useMemo(() => {
    return { Notifystate, dispatchState };
  }, [Notifystate, dispatchState]);

  const darkmode = store.getState().auth.darkmode;
  const userData = store.getState().auth.userData;
  const type = store.getState().auth.type;
  const [statusData, setStatusData] = useState('active');

  if (darkmode === false) {
    dispatch(setBaseColor(BaseColors));
  } else {
    dispatch(setBaseColor(DarkBaseColor));
  }

  const [darkApp, setdarkApp] = useState(darkmode);

  // Please do not remove this commented code
  // useEffect(() => {
  //   // Subscribe to app state changes
  //   appStatus(1);

  //   function handleAppStateChange(nextAppState) {
  //     getStatus();

  //     if (statusData && statusData !== nextAppState) {
  //       if (nextAppState === 'background') {
  //         dispatch({ type: 'socket/disconnect' });
  //         appStatus(0);
  //       } else {
  //         dispatch({ type: 'socket/connect' });
  //         appStatus(1);
  //       }
  //     } else {
  //       appStatus(1);
  //     }
  //   }

  //   // Add event listener for app state changes
  //   AppState.addEventListener('change', handleAppStateChange);

  //   // Remove event listener when the component unmounts
  //   const cleanup = () => {
  //     if (AppState.removeEventListener) {
  //       AppState.removeEventListener('change', handleAppStateChange);
  //     }
  //   };

  //   return cleanup;
  // }, []);

  useEffect(() => {
    const eventListener = EventRegister.addEventListener(
      'changeAppTheme',
      data => {
        setdarkApp(data);
        dispatch(setDarkmode(data));
      },
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  // useEffect(() => {
  //   if (isObject(userData) && !isEmpty(userData)) {
  //     dispatch({ type: 'socket/connect' }); // connect
  //   }
  // }, [userData]);

  // notification using socket
  useEffect(() => {
    dispatch({ type: 'socket/notification' });

    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [userData]);

  // post app status
  // Please do not remove this function
  const appStatus = async status => {
    let endPoints = BaseSetting.endpoints.appStatus;
    const params = {
      status: status === 0 ? 'inactive' : 'active',
      id: userData.id,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
      } else {
      }
    } catch (error) {
      console.log('ERRRRR', error);
    }
  };

  // Please do not remove this function
  const getStatus = async () => {
    let endPoints = BaseSetting.endpoints.getStatus;

    try {
      const resp = await getApiData(endPoints, 'GET', '', {}, false);
      console.log('resp get status =======>>>', resp);
      if (resp?.status) {
        setStatusData(resp?.data);
        console.log('status', resp?.data);
      } else {
        console.log('appStatus error', resp?.message);
      }
    } catch (error) {
      console.log('ERRRRR', error);
    }
  };

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...BaseColors,
    },
  };

  const appTheme = lightTheme;

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const HomeStack = createStackNavigator();
  const EventsStack = createStackNavigator();
  const NotificationStack = createStackNavigator();
  const ProfileStack = createStackNavigator();

  const HomeStackNavigator = () => {
    return (
      <HomeStack.Navigator
        detachInactiveScreens={IOS ? true : false}
        screenOptions={{ animationEnabled: false }}
      >
        <HomeStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </HomeStack.Navigator>
    );
  };

  const EventsStackNavigator = () => {
    return (
      <EventsStack.Navigator
        detachInactiveScreens={IOS ? true : false}
        screenOptions={{ animationEnabled: false }}
      >
        <EventsStack.Screen
          name="Events"
          component={Events}
          options={{ headerShown: false }}
        />
      </EventsStack.Navigator>
    );
  };

  const NotificationStackNavigator = () => {
    return (
      <NotificationStack.Navigator
        detachInactiveScreens={IOS ? true : false}
        screenOptions={{ animationEnabled: false }}
      >
        <NotificationStack.Screen
          name="Events"
          component={Notification}
          options={{ headerShown: false }}
        />
      </NotificationStack.Navigator>
    );
  };

  const ProfileStackNavigator = () => {
    return (
      <ProfileStack.Navigator
        detachInactiveScreens={IOS ? true : false}
        screenOptions={{ animationEnabled: false }}
      >
        <ProfileStack.Screen
          name="Events"
          component={Profile}
          options={{ headerShown: false }}
        />
      </ProfileStack.Navigator>
    );
  };

  const BottomTabsNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName={'HomeStackNavigator'}
        tabBar={props => <BottomTabBar {...props} />}
      >
        <Tab.Screen
          name="HomeStackNavigator"
          component={HomeStackNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Tab.Screen
          name="EventsStackNavigator"
          component={EventsStackNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Tab.Screen
          name="NotificationStackNavigator"
          component={NotificationStackNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Tab.Screen
          name="ProfileStackNavigator"
          component={ProfileStackNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NotificationContext.Provider value={notiValue}>
      <NavigationContainer ref={navigationRef} theme={appTheme}>
        <Stack.Navigator
          initialRouteName={'SplashScreen'}
          detachInactiveScreens={IOS ? true : false}
          screenOptions={{
            animationEnabled: true,
            gestureEnabled: IOS ? true : false,
          }}
        >
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false, animationEnabled: false }}
          />
          <Stack.Screen
            name="Home"
            component={BottomTabsNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EventDetails"
            component={EventDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TermsofServices"
            component={TermsofServices}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CalibrationInstruction"
            component={Instructions}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Callibration"
            component={Callibration}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="CallibrationStart"
            component={CallibrationStart}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="CallibrationSuccess"
            component={Success}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Symptom"
            component={Symptom}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Symptoms"
            component={Symptoms}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Assessment"
            component={Assessment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangeInfo"
            component={ChangeInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTP"
            component={OTP}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TwofactorEnabled"
            component={TwofactorEnabled}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ImmediateRecall"
            component={ImmediateRecall}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Wordlist"
            component={Wordlist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DigitalRecall"
            component={DigitalRecall}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Recalldigits"
            component={Recalldigits}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FaceidEnabled"
            component={FaceidEnabled}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ImmediateRecallmain"
            component={ImmediateRecallmain}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VoiceInput"
            component={VoiceInput}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Comment"
            component={Comment}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AuthenticationFactor"
            component={AuthenticationFactor}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ExampleRadarChart"
            component={ExampleRadarChart}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InsideNotification"
            component={InsideNotification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Upper"
            component={Upper}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lower"
            component={Lower}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <RemotePushController />
    </NotificationContext.Provider>
  );
}

export default App;
