import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';
import LabeledInput from '@components/LabeledInput';
import Button from '@components/Button';
import { Images } from '@config';
import { TouchableOpacity } from 'react-native';
import BaseSetting from '@config/setting';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { getApiData } from '@utils/apiHelper';
import Authentication from '@redux/reducers/auth/actions';
import { BaseColors } from '@config/theme';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { storeCredentials } from '@utils/CommonFunction';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import _ from 'lodash';
import { AppleLogo, Loginwithfaceid } from '@components/SVG_Bundle';
import { CheckBox } from 'react-native-elements';
const Login = ({ navigation }) => {
  const [warning, setWarning] = useState('');
  const {
    setUserData,
    setAccessToken,
    setBiometric,
    setRefreshTokenExpire,
    setDevMode,
  } = Authentication;
  const { isBiometric, darkmode, fcmToken, DevMode } = useSelector(
    state => state.auth,
  );
  console.log('TCL: Login -> DevMode', DevMode);
  const IOS = Platform.OS === 'ios';
  const emailRegex = BaseSetting?.emailRegex;
  const dispatch = useDispatch();
  const cInputRef = useRef();
  const [googleBtnLoad, setGoogleBtnLoad] = useState(false);
  const [email, setEmail] = useState(__DEV__ ? 'suhani@mailinator.com' : '');
  const [password, setPassword] = useState(__DEV__ ? '123456789' : '');
  const [loader, setLoader] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('Development');
  const [emailErrObj, setEmailErrObj] = useState({ error: false, msg: '' });
  const [passErrObj, setPassErrObj] = useState({ error: false, msg: '' });

  const [clickCount, setClickCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const handleOculoImageClick = () => {
    setClickCount(prevCount => prevCount + 1);

    if (clickCount === 9) {
      setModalVisible(true);
      return 0; // Reset count to 0 when modal is opened
    }
  };

  useEffect(() => {
    // Reset clickCount when the modal is closed
    if (!modalVisible) {
      setClickCount(0);
    }
  }, [modalVisible]);
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleUrlClick = url => {
    let devModePayload = {};

    if (url === 'Production') {
      devModePayload = { Production: true, Development: false, UAT: false };
    } else if (url === 'Development') {
      devModePayload = { Production: false, Development: true, UAT: false };
    } else if (url === 'UAT') {
      devModePayload = { Production: false, Development: false, UAT: true };
    }

    dispatch(setDevMode(devModePayload));
    setSelectedUrl(url); // Set the selected URL in the state
  };

  // const toggleDevMode = () => {
  //   const newDevMode = !devMode;
  //   setDevMode(newDevMode);
  //   dispatch(Authentication.setDevMode(newDevMode));
  // };

  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  // This commonSigninMethod will works for all three flows which will set after signin success
  // 1. Normal Signin
  // 2. Apple Signin
  // 3. Google Signin
  const commonSigninMethod = result => {
    dispatch(setRefreshTokenExpire(result?.data?.refresh_token_expired_at));
    const dataBundle = {
      ...result?.data?.personal_info,
      refresh_token_expired_at: result?.data?.refresh_token_expired_at,
    };
    dispatch(setUserData(dataBundle));
    dispatch(setAccessToken(result?.data?.auth_token));
    navigation.reset({
      routes: [{ name: 'Home' }],
    });
    dispatch({ type: 'socket/connect' }); // connect
  };

  // signin with google setup
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: BaseSetting.GOOGLE_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    setGoogleBtnLoad(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      connectWithGoogle(accessToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('error 1', error);
        // user cancelled the login flow
        console.log('error 2', error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('error 3', error);
        // play services not available or outdated
      } else {
        console.log('error 4', error);
        // some other error happened
      }
    } finally {
      setGoogleBtnLoad(false); // Ensure this is called to stop the loading indicator
    }
  };

  async function connectWithGoogle(accessToken) {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.googleLogin,
        'POST',
        {
          token: accessToken,
          platform: Platform.OS,
          domain: 'neptune',
          type: 'google',
        },
        '',
        false,
      );
      if (response?.status) {
        commonSigninMethod(response);
      } else {
        alert(response?.message);
        signOut();
        setWarning(response?.message);
      }
    } catch (error) {
      console.log('error while signin with google =======>>>', error);
    }
  }
  const signOut = async () => {
    try {
      const res = await GoogleSignin.signOut();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setEmailErrObj({ error: false, msg: '' });
    setPassErrObj({ error: false, msg: '' });
  }, []);

  const getStoredCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const { username, password } = credentials;
        LoginCall('bio', username, password);
      } else {
        console.log('No credentials stored.');
        return;
      }
    } catch (error) {
      console.log('Error retrieving credentials:', error);
      return;
    }
  };

  const checkBiometrics = async () => {
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
                    checkSignature();
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
        });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Please turn on and add your device fingerprint',
      });
      console.log(error);
      // moveToParticularPage();
    }
  };

  const checkSignature = async () => {
    rnBiometrics
      .createSignature({
        promptMessage: 'Sign in',
        payload: payload,
      })
      .then(resultObject => {
        console.log('resultObject ===check signature==>>> ', resultObject);
        const { success, signature } = resultObject;

        if (success) {
          getStoredCredentials();
          // moveToParticularPage();
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
      });
  };

  // login call
  const LoginCall = async (from, id, pass) => {
    setLoader(true);
    let endPoints = BaseSetting.endpoints.login;
    const params = {
      email: from === 'bio' ? id : email.trim(),
      password: from === 'bio' ? pass : password,
      uuid: fcmToken,
      platform: Platform.OS,
      domain: 'neptune',
      checked: checked ? 1 : 0,
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        dispatch({ type: 'socket/connect' });
        if (resp?.data?.check_data?.is_password_set === 0) {
          dispatch(setBiometric(false));
          navigation.reset({
            routes: [
              {
                name: 'ResetPassword',
                params: {
                  email: from === 'bio' ? id : email,
                  from: 'tfa',
                  isPassword: 1,
                },
              },
            ],
          });
          clearData();
          setLoader(false);
        } else if (resp?.data?.enable_2fa) {
          generateOTP(
            from,
            id,
            pass,
            resp?.data?.personal_info?.phone,
            resp?.data?.personal_info?.two_factor_type,
          );
        } else {
          storeCredentials(
            from === 'bio' ? id : email,
            from === 'bio' ? pass : password,
          );
          commonSigninMethod(resp);
          clearData();
          setLoader(false);
        }
      } else {
        Toast.show({
          text1: resp?.message,
          text2: resp?.notice,
          type: 'error',
        });
        setLoader(false);
      }
    } catch (error) {
      Toast.show({
        text1: error?.toString(),
        type: 'error',
      });
      console.log('ERRRRR', error);
      setLoader(false);
    }
  };

  // generate OTP
  const generateOTP = async (from, id, pass, phone, factorType) => {
    setLoader(true);
    let endPoints = BaseSetting.endpoints.generateOtp;
    const params = {
      value: from === 'bio' ? id : email,
      type: 'email',
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        Toast.show({
          text1: resp?.message?.toString(),
          type: 'success',
          visibilityTime: 10000,
          autoHide: true,
        });
        navigation.navigate('OTP', {
          email: from === 'bio' ? id : email,
          from: 'tfa',
          phone: phone,
          password: from === 'bio' ? pass : password,
          medium: factorType,
          checked: checked,
        });
      } else {
        Toast.show({
          text1: resp?.message,
          type: 'error',
        });
      }
      clearData();
      setLoader(false);
    } catch (error) {
      Toast.show({
        text1: error?.toString(),
        type: 'error',
      });
      console.log('ERRRRR', error);
      setLoader(false);
    }
  };

  function clearData() {
    setEmail('');
    setPassword('');
  }

  function validation() {
    let valid = true;

    // validate email
    if (email == '') {
      valid = false;
      setEmailErrObj({
        error: true,
        msg: 'Please enter email',
      });
    } else if (!emailRegex.test(email)) {
      valid = false;
      setEmailErrObj({
        error: true,
        msg: 'Please enter valid email',
      });
    } else {
      setEmailErrObj({
        error: false,
        msg: '',
      });
    }

    // validate password
    if (password == '') {
      valid = false;
      setPassErrObj({
        error: true,
        msg: 'Please enter password',
      });
    } else if (password.length < 8 || password.length > 15) {
      valid = false;
      setPassErrObj({
        error: true,
        msg: 'Password length must be of 8-15',
      });
    } else {
      setPassErrObj({
        error: false,
        msg: '',
      });
    }

    if (valid) {
      LoginCall();
    }
  }

  // Apple signin here
  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      handleAppleLogin(
        appleAuthRequestResponse,
        appleAuthRequestResponse?.identityToken,
      );
    } catch (error) {
      console.log('error = signInWithApple ====>>> ', error);
    }
  };
  const handleAppleLogin = (appAuth, token) => {
    const userToken = _.isString(token) ? token : '';

    const data = {
      token: userToken,
      type: 'apple',
      uuid: fcmToken,
      plateform_type: Platform.OS === 'ios' ? 'ios' : 'android',
    };

    getApiData(BaseSetting.endpoints.googleLogin, 'POST', data, '', false)
      .then(result => {
        if (result.status) {
          const { identityToken, nonce } = appAuth;
          const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
          );
          auth().signInWithCredential(appleCredential);
          commonSigninMethod(result);
        } else {
          alert(result?.message);
          console.log('ERROR');
        }
      })
      .catch(error => {
        console.warn('💥️ handleAppleLogin  error ->', error);
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
        contentContainerStyle={styles.contentView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={{ paddingTop: 30, paddingBottom: 20 }}>
          <TouchableOpacity onPress={handleOculoImageClick}>
            <Image
              source={Images.logo}
              resizeMode="contain"
              style={styles.img}
              tintColor={BaseColors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputcontainer}>
          <LabeledInput
            loginSide
            changeViewWidthSty={{
              color: darkmode ? 'red' : BaseColors.white,
            }}
            Label={'EMAIL'}
            mailicon
            returnKeyType="next"
            placeholder={'Enter Email'}
            value={email}
            onChangeText={val => {
              setEmail(val);
              setEmailErrObj({ error: false, msg: '' });
            }}
            showError={emailErrObj.error}
            errorText={emailErrObj.msg}
          />

          <LabeledInput
            ref={cInputRef}
            changeViewWidthSty={{
              color: darkmode ? 'red' : BaseColors.white,
            }}
            LabledInputStyle={{ marginTop: 20 }}
            Label={'Password'}
            keyicon
            value={password}
            placeholder={'Enter Password'}
            eyePassword
            onChangeText={val => {
              setPassword(val);
              setPassErrObj({ error: false, msg: '' });
            }}
            showError={passErrObj.error}
            errorText={passErrObj.msg}
            onSubmitEditing={validation}
          />

          <View
            style={{
              marginTop: 6,
              alignItems: 'flex-end',
            }}
          >
            <TouchableOpacity
              activeOpacity={BaseSetting.buttonOpacity}
              onPress={() => navigation.navigate('ForgetPassword')}
            >
              <Text style={styles.forgotPasswordTextStyle}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <CheckBox
              containerStyle={{
                borderColor: BaseColors.transparent,
                backgroundColor: BaseColors.transparent,
                color: BaseColors.textColor,
                margin: 0,
                padding: 0,
              }}
              title={'Stay signed in to receive notifications'}
              checked={checked}
              onPress={() => {
                setChecked(!checked);
              }}
              titleProps={{
                style: {
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                },
              }}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              shape="round"
              title={'Sign in'}
              style={styles.signinbutton}
              onPress={validation}
              loading={loader}
            />
            {Platform.OS === 'ios' && isBiometric ? (
              <TouchableOpacity
                activeOpacity={BaseSetting.buttonOpacity}
                onPress={() => {
                  checkBiometrics();
                }}
                style={{ marginLeft: 20 }}
              >
                <Loginwithfaceid />
              </TouchableOpacity>
            ) : (
              isBiometric && (
                <TouchableOpacity
                  activeOpacity={BaseSetting.buttonOpacity}
                  onPress={() => {
                    checkBiometrics();
                  }}
                >
                  <Icon name="finger-print" size={30} style={styles.fingIcon} />
                </TouchableOpacity>
              )
            )}
          </View>
          <Text
            style={[
              styles.orText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            OR
          </Text>
          <View style={styles.cover}>
            <TouchableOpacity
              style={[
                styles.gBtn,
                {
                  borderColor: darkmode ? BaseColors.white : BaseColors.black50,
                  width: !IOS ? '100%' : '48%',
                },
              ]}
              onPress={() => {
                if (!googleBtnLoad) {
                  signIn();
                }
              }}
              activeOpacity={googleBtnLoad && 1}
            >
              {googleBtnLoad ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.outer}>
                  <View style={styles.gBtnWrapper}>
                    <Image
                      source={Images.gIcon}
                      style={{ height: 14, width: 14 }}
                    />
                  </View>
                  <Text
                    style={[
                      styles.gText,
                      {
                        color: darkmode
                          ? BaseColors.white
                          : BaseColors.textGrey,
                      },
                    ]}
                  >
                    Sign in with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {IOS && (
              <>
                <TouchableOpacity
                  style={[
                    styles.gBtn,
                    {
                      borderColor: darkmode
                        ? BaseColors.white
                        : BaseColors.black50,
                      width: '48%',
                    },
                  ]}
                  onPress={() => signInWithApple()}
                >
                  <View style={styles.outer}>
                    <View style={styles.gBtnWrapper}>
                      <AppleLogo
                        fill={darkmode ? BaseColors.white : BaseColors.black}
                        height={18}
                        width={18}
                      />
                    </View>
                    <Text
                      style={[
                        styles.gText,
                        {
                          color: darkmode
                            ? BaseColors.white
                            : BaseColors.textGrey,
                        },
                      ]}
                    >
                      Sign in with Apple
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={{
                    height: 48,
                  }}
                  onPress={() => signInWithApple()}
                /> */}
              </>
            )}
            <Text style={{ padding: 5 }}>{warning ? warning : ''}</Text>
          </View>
          <Modal visible={modalVisible} onRequestClose={closeModal} transparent>
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: !darkmode
                    ? BaseColors.black90
                    : BaseColors.white80,
                },
              ]}
            >
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: !darkmode
                      ? BaseColors.white
                      : BaseColors.lightBlack,
                  },
                ]}
              >
                <TouchableOpacity onPress={() => handleUrlClick('Production')}>
                  <Text
                    style={[
                      {
                        padding: 5,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                      },
                      {
                        color:
                          selectedUrl === 'Production'
                            ? BaseColors.primary
                            : darkmode
                            ? BaseColors.white
                            : BaseColors.textColor,
                      },
                    ]}
                  >
                    Production
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUrlClick('Development')}>
                  <Text
                    style={[
                      {
                        padding: 5,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                      },
                      {
                        color:
                          selectedUrl === 'Development'
                            ? BaseColors.primary
                            : darkmode
                            ? BaseColors.white
                            : BaseColors.textColor,
                      },
                    ]}
                  >
                    Development
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUrlClick('UAT')}>
                  <Text
                    style={[
                      {
                        padding: 5,
                        textAlign: 'center',
                        fontSize: 18,
                        marginBottom: 30,
                        fontWeight: 'bold',
                      },
                      {
                        color:
                          selectedUrl === 'UAT'
                            ? BaseColors.primary
                            : darkmode
                            ? BaseColors.white
                            : BaseColors.textColor,
                      },
                    ]}
                  >
                    UAT
                  </Text>
                </TouchableOpacity>

                <Button onPress={closeModal} round title="Close">
                  <Text>Close Modal</Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
