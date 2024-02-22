import {
  View,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import styles from './styles';
import Button from '@components/Button';
import { Images } from '@config';
import BaseSetting from '@config/setting';
import { useState } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { useDispatch, useSelector } from 'react-redux';
import Authentication from '@redux/reducers/auth/actions';
import { BaseColors } from '@config/theme';
import { Loginwithfaceid } from '@components/SVG_Bundle';

const FaceidEnabled = ({ navigation, route }) => {
  const { darkmode } = useSelector(state => state.auth);
  const { setBiometric } = Authentication;
  const [loader, setLoader] = useState(false);
  const IOS = Platform.OS === 'ios';
  const dispatch = useDispatch();

  const { isBiometric } = useSelector(state => {
    return state.auth;
  });

  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const checkBiometrics = async () => {
    setLoader(true);
    try {
      rnBiometrics.isSensorAvailable().then(resultObject => {
        const { available, biometryType } = resultObject;

        if (available && biometryType === BiometryTypes.TouchID) {
          console.log('TouchID is supported');
          authenticate();
        } else if (available && biometryType === BiometryTypes.FaceID) {
          console.log('FaceID is supported');
          authenticate();
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          console.log('Biometrics is supported');
          authenticate();
        } else {
          console.log('Biometrics not supported');
          authenticate();
        }
      });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const authenticate = async () => {
    try {
      rnBiometrics
        .biometricKeysExist()
        .then(resultObject => {
          const { keysExist } = resultObject;
          console.log('resultObject ==key exists or not===>>> ', resultObject);
          if (keysExist) {
            checkSignature();
          } else {
            rnBiometrics
              .createKeys()
              .then(resultObject => {
                console.log('resultObject ==create keys===>>> ', resultObject);
                const { publicKey } = resultObject;
                if (publicKey) {
                  setTimeout(() => {
                    // checkSignature();
                  }, 400);
                }
              })
              .catch(error => {
                // moveToParticularPage();
                console.log('Create keys error-----', error);
              });
          }
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Please turn on and add your device fingerprint',
          });
          console.log('Authentic error--', err);
          // moveToParticularPage();
          setLoader(false);
        });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Please turn on and add your device fingerprint',
      });
      console.log(error);
      // moveToParticularPage();
      setLoader(false);
    }
  };

  const checkSignature = () => {
    rnBiometrics
      .createSignature({
        promptMessage: 'Sign in',
        payload: payload,
      })
      .then(resultObject => {
        console.log('resultObject ===check signature==>>> ', resultObject);
        const { success, signature } = resultObject;

        if (success) {
          dispatch(setBiometric(!isBiometric));
          navigation.reset({
            routes: [{ name: 'TwofactorEnabled' }],
          });
          setLoader(false);
        } else {
          setTimeout(() => {
            checkSignature();
          }, 3000);
        }
      })
      .catch(err => {
        console.log('Err----', err);
        if (Platform.OS === 'ios') {
          Toast.show({
            type: 'error',
            text1: 'Please try again by reopen the app',
          });
        } else {
          // moveToParticularPage();
        }
        setLoader(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={IOS ? 'padding' : 'height'}
      style={[
        styles.container,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoView}>
          <Image
            source={Images.logo}
            resizeMode="contain"
            style={{ height: 55, width: '90%' }}
            tintColor={BaseColors.primary}
          />
        </View>
        <View style={styles.imgContainer}>
          <Loginwithfaceid />
        </View>
        <View style={styles.dropdownContainer}>
          <View style={styles.btnContainer}>
            <Button
              shape="round"
              title={'Enabled Face ID'}
              style={styles.button}
              loading={loader}
              onPress={checkBiometrics}
            />
            <TouchableOpacity activeOpacity={BaseSetting.buttonOpacity}>
              <Text
                style={styles.skip}
                onPress={() => {
                  navigation.reset({
                    routes: [{ name: 'TwofactorEnabled' }],
                  });
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FaceidEnabled;
