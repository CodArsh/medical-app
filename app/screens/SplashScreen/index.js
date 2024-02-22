import React, { useEffect, useState } from 'react';
import styles from './styles';
import { StatusBar, View, Image, Animated } from 'react-native';
import { Images } from '@config';
import { useDispatch, useSelector } from 'react-redux';
import _, { isEmpty } from 'lodash';
import AnimatedReact, {
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Authentication from '@redux/reducers/auth/actions';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';

const SplashScreen = ({ navigation }) => {
  const { darkmode, userData } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { setFcmToken, setUserData } = Authentication;
  useEffect(() => {
    requestUserPermission();
  }, []);

  const ref_token = !_.isEmpty(userData)
    ? userData?.refresh_token_expired_at
    : '';

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      GetFcmToken();
    }
  }
  async function GetFcmToken() {
    let fcmToken = await AsyncStorage.getItem('fcmtoken');
    console.log('oldToken => ', fcmToken);
    if (!fcmToken) {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log('NEW Token => ', fcmToken);
          await AsyncStorage.setItem('fcmtoken', fcmToken);
          dispatch(setFcmToken(fcmToken));
        }
      } catch (error) {
        console.log('Error while get fcmtoken ===> ', error);
      }
    }
  }
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
    }).start();
    const delayDebounceFn = setTimeout(() => {
      if (!isEmpty(userData)) {
        getLatestData();
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 3000);
    // Cleanup the timeout to avoid unnecessary API calls
    return () => clearTimeout(delayDebounceFn);
  }, []);

  const getLatestData = async () => {
    const endPoint = `${BaseSetting.endpoints.getPatient}?created_from=app`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        const updatedWithRefreshToken = {
          ...res?.data,
          refresh_token_expired_at: ref_token,
        };

        dispatch(setUserData(updatedWithRefreshToken));
      }
    } catch (error) {
      console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
    }
  };

  // new features added (regarding : Animations)
  const Anim_H = useSharedValue(15);
  useEffect(() => {
    Anim_H.value = withTiming(Anim_H.value + 50, { duration: 1000 });
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={'#0000'}
        // translucent
        barStyle="dark-content"
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
        >
          <AnimatedReact.Image
            source={Images.logo}
            resizeMode="contain"
            style={{ width: BaseSetting.nWidth - 50 }}
            tintColor={BaseColors.primary}
          />
        </Animated.View>
      </View>
    </>
  );
};

export default SplashScreen;
