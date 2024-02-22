import * as React from 'react';
import {
  NativeModules,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import AuthAction from '@redux/reducers/auth/actions';
import { navigationRef } from '../navigation/NavigationService';
import { store } from '@redux/store/configureStore';
import * as Keychain from 'react-native-keychain';

const { setAccessToken, setUserData } = AuthAction;

export const logout = async () => {
  await store.dispatch(setAccessToken(''));
  await store.dispatch(setUserData({}));
  await store.dispatch({ type: 'socket/disconnect' });
  navigationRef?.current?.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
};

export const getDevLang = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  const dvlangSplit = deviceLanguage.split('_');
  const dvlang = dvlangSplit[0].toString();

  if (dvlang == 'zh') {
    return 'zh-Hant';
  } else if (dvlang == 'fil') {
    return 'fil';
  } else {
    return 'en-us';
  }
};

export function isValidPhonenumber(inputtxt) {
  let phoneno = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

export const storeCredentials = async (username, password) => {
  try {
    await Keychain.setGenericPassword(username, password);
    console.log('Credentials stored successfully!');
  } catch (error) {
    console.log('Error storing credentials:', error);
  }
};

export const removeCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
};

export const enableAnimateInEaseOut = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const enableAnimateLinear = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
};

export const enableAnimateSpring = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
};

export const getDate = () => {
  return new Date()
    .toLocaleString('en-GB', {
      timeZone: 'asia/calcutta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    })
    .replace(',', '');
};
