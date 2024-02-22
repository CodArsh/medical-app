import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import TabSwitch from '@components/TabSwitch';
import Icon from 'react-native-vector-icons/AntDesign';
import { BaseColors } from '@config/theme';
import ProfilehistoryButton from '@components/ProfilehistoryButton';
import { logout } from '@utils/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import Authentication from '@redux/reducers/auth/actions';
import Dropdown from '@components/Dropdown';
import Profiledetailcomponent from '@components/Profiledetailcomponent';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useIsFocused } from '@react-navigation/native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import BaseSetting from '@config/setting';
import InfoCard from '@components/InfoCard';
import { items, legal, settings, switchOptions } from '@config/staticData';
import moment from 'moment';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { getApiData } from '@utils/apiHelper';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import _ from 'lodash';
import MainLoader from '@components/MainLoader';
import Button from '@components/Button';
export default function Profile({ navigation }) {
  const {
    isBiometric,
    userData,
    darkmode,
    fcmToken,
    googleAttached,
    appleAttached,
  } = useSelector(state => {
    return state.auth;
  });
  const { setDarkmode, setBiometric, setGoogleAttached, setAppleAttached } =
    Authentication;
  const [settingData, setSettinData] = useState(settings);

  const signIn = async () => {
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
    }
  };

  async function connectWithGoogle(accessToken) {
    try {
      const params = {
        token: accessToken,
        type: 'google',
      };
      const response = await getApiData(
        BaseSetting.endpoints.googleConnect,
        'POST',
        params,
        '',
        false,
      );
      if (response?.status) {
        dispatch(setGoogleAttached(true));
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
      } else {
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log('error while posting comment =======>>>', error);
    }
  }

  // CONNECT WITH APPLE
  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      handleAppleLogin(appleAuthRequestResponse?.identityToken);
    } catch (error) {
      console.log('error = signInWithApple ====>>> ', error);
    }
  };
  const handleAppleLogin = token => {
    const userToken = _.isString(token) ? token : '';

    const data = {
      token: userToken,
      type: 'apple',
      uuid: fcmToken,
      plateform_type: Platform.OS === 'ios' ? 'ios' : 'android',
    };

    getApiData(BaseSetting.endpoints.googleConnect, 'POST', data, '', false)
      .then(result => {
        if (result.status) {
          dispatch(setAppleAttached(true));
          Toast.show({
            type: 'success',
            text1: result?.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: result?.message,
          });
          console.log('ERROR');
        }
      })
      .catch(error => {
        console.warn('💥️ handleAppleLogin  error ->', error);
      });
  };

  // DISCONNECT WITH APPLE
  const signOutWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({});
      handleAppleSignOut(appleAuthRequestResponse?.identityToken);
      console.log('..1...', appleAuthRequestResponse);
    } catch (error) {
      console.log('error = signInWithApple ====>>> ', error);
    }
  };
  const handleAppleSignOut = token => {
    const userToken = _.isString(token) ? token : '';
    const data = {
      token: userToken,
      type: 'apple',
      uuid: fcmToken,
      plateform_type: Platform.OS === 'ios' ? 'ios' : 'android',
    };

    getApiData(
      BaseSetting.endpoints.googleDisconnect,
      'POST',
      data,
      '',
      false,
    ).then(result => {
      console.log('RESP : ', result);
      console.log('DATA : ', data);
      if (result.status) {
        dispatch(setAppleAttached(false));
        Toast.show({
          type: 'success',
          text1: result?.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
        });
        console.log('ERROR');
      }
    });
  };
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editHistory, setEditHistory] = useState(false);
  const [rightHistoryText, setRightHistoryText] = useState('Edit');
  const profileRef = useRef();
  const historyRef = useRef();
  const [showAllSports, setShowAllSports] = useState(false); // State to toggle between showing all sports and only the first two
  const [sportsList, setSportsList] = useState([]);
  const IOS = Platform.OS === 'ios';
  const [activeTab, setActiveTab] = useState({
    id: 'detail',
    name: 'Details',
  });

  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  const [showModal, setShowModal] = useState(false);

  const renderSports = sportIds => {
    if (sportIds?.length === 0) {
      return '_';
    } else if (sportIds?.length === 1) {
      return getSportName(sportIds[0]);
    } else {
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Text>{getSportName(sportIds[0])}</Text>
            <Text>...</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                color: BaseColors.primary,
                textAlign: 'center',
                fontSize: 13,
              }}
            >
              View More
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const getSportName = id => {
    const sport = sportsList.find(sport => sport.id === id);
    return sport ? sport.sport_name : `Sport ${id}`;
  };

  const patientdata = [
    {
      id: '1',
      leftIcon: 'user-o',
      title: 'First Name',
      righttitle:
        userData?.firstname?.length > 15
          ? userData?.firstname?.substring(0, 15) + '.....'
          : userData?.firstname,
    },
    {
      id: '2',
      leftIcon: 'user-o',
      title: 'Middle Name',
      righttitle:
        userData?.middlename?.length > 15
          ? userData?.middlename?.substring(0, 15) + '.....'
          : userData?.middlename,
    },
    {
      id: '7',
      leftIcon: 'user-o',
      title: 'Last Name',
      righttitle:
        userData?.lastname?.length > 15
          ? userData?.lastname?.substring(0, 15) + '.....'
          : userData?.lastname,
    },
    {
      id: '3',
      leftIcon: 'calendar',
      title: 'Date of Birth',
      righttitle: moment(userData?.dob).format('MM-DD-YYYY'),
    },
    {
      id: '9',
      leftIcon: 'transgender',
      title: 'Gender',
      righttitle: userData?.gender ? userData.gender : '_',
    },
    {
      id: '5',
      leftIcon: 'mars-stroke-h',
      title: 'Pronouns',
      righttitle:
        userData?.pronouns == '1'
          ? 'She/Her/Hers'
          : userData?.pronouns == '2'
          ? 'He/Him/His'
          : userData?.pronouns == '3'
          ? 'They/Them/Their'
          : userData?.pronouns == '4'
          ? 'Ze/Zir/Zirs'
          : userData?.pronouns == '5'
          ? 'Ze/Hir/Hirs'
          : '_',
    },
    {
      id: '6',
      leftIcon: 'transgender-alt',
      title: 'Sex',
      righttitle:
        userData?.sex == '0'
          ? 'Female'
          : userData?.sex == '1'
          ? 'Male'
          : userData?.sex == '2'
          ? 'Intersex'
          : '_',
    },

    {
      id: '10',
      leftIcon: 'sports',
      title: 'Sport',
      righttitle: renderSports(userData?.sport_ids),
    },

    {
      id: '11',
      leftIcon: 'graduation-cap',
      title: 'Graduation Year',
      righttitle: userData?.graduation_year ? userData.graduation_year : '_',
    },
    {
      id: '12',
      leftIcon: 'graduation-cap',
      title: 'Graduation Season',
      righttitle: userData?.graduation_season
        ? userData.graduation_season === '1'
          ? 'Winter'
          : userData.graduation_season === '2'
          ? 'Spring'
          : userData.graduation_season === '3'
          ? 'Summer'
          : userData.graduation_season === '4'
          ? 'Fall'
          : null
        : '_',
    },
  ];

  const contactdata = [
    {
      id: '1',
      leftIcon: 'phone',
      title: 'Patient Phone',
      righttitle: userData?.phone,
    },
    {
      id: '2',
      leftIcon: 'envelope-o',
      title: 'Patient Email',
      righttitle: userData?.email,
    },
    {
      id: '3',
      leftIcon: 'phone',
      title: 'Guardian phone',
      righttitle: userData?.guardian_phone
        ? userData?.guardian_phone
        : userData?.emergency_phone,
    },
    {
      id: '10',
      leftIcon: 'envelope-o',
      title: 'Guardian email',
      righttitle: userData?.guardian_email
        ? userData?.guardian_email
        : userData?.emergency_email,
    },
  ];

  useEffect(() => {
    const desiredGoogleObject = settings.find(item => item.id === '3');
    const desiredAppleObject = settings.find(item => item.id === '4');
    const updatedGoogleTitle = {
      title: !googleAttached ? 'Connect With Google' : 'Disconnect With Google',
    };
    const updatedAppleTitle = {
      title: !appleAttached ? 'Connect With Apple' : 'Disconnect With Apple',
    };
    const newObjGoogle = { ...desiredGoogleObject, ...updatedGoogleTitle };
    const newObjApple = { ...desiredAppleObject, ...updatedAppleTitle };
    const newArray = settings?.map(item =>
      item.id === newObjGoogle.id
        ? newObjGoogle
        : item.id === newObjApple.id
        ? newObjApple
        : item,
    );

    setSettinData(newArray);
  }, [googleAttached, appleAttached]);

  // signin with google setup
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '892302063818-h59tbg70l3lbsgqlj43ojfr35d89sa88.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    setConfirmLoading(false);
  }, [showSignOutConfirmation]);

  useEffect(() => {
    setValue(userData?.two_factor_type);
  }, [isFocused]);

  useEffect(() => {
    setEditHistory(false);
    setRightHistoryText('Edit');
  }, [activeTab, isFocused]);

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
          if (isBiometric) {
            dispatch(setBiometric(false));
          } else {
            if (Platform.OS !== 'ios') {
              Toast.show({
                type: 'error',
                text1: 'Please turn on and add your device fingerprint',
              });
            }
          }
          // authenticate();
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
          if (keysExist) {
            checkSignature();
          } else {
            rnBiometrics
              .createKeys()
              .then(resultObject => {
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
        });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Please turn on and add your device fingerprint',
      });
      console.log(error);
    }
  };

  // this function is used to recreate key
  const recreateKeysAndAuthenticate = () => {
    rnBiometrics
      .createKeys()
      .then(resultObject => {
        const { publicKey } = resultObject;
        if (publicKey) {
          const timeoutId = setTimeout(() => {
            checkSignature();
          }, 3000);

          // To clear the timeout before it executes
          clearTimeout(timeoutId);
        }
      })
      .catch(error => {
        console.log('Recreate keys error-----', error);
        Toast.show({
          type: 'error',
          text1: 'Please try again by reopening the app',
        });
      });
  };

  const checkSignature = () => {
    rnBiometrics
      .createSignature({
        promptMessage: 'Sign in',
        payload: payload,
      })
      .then(resultObject => {
        const { success, signature } = resultObject;

        if (success) {
          dispatch(setBiometric(!isBiometric));
        } else {
          const { code, message } = resultObject.error;
          if (code === 'KEY_PERMANENTLY_INVALIDATED') {
            // Handle key permanently invalidated, prompt user to reauthenticate
            recreateKeysAndAuthenticate();
          } else {
            const timeoutId = setTimeout(() => {
              checkSignature();
            }, 3000);

            // To clear the timeout before it executes
            clearTimeout(timeoutId);
          }
        }
      })
      .catch(err => {
        console.log('Err----', err);
        recreateKeysAndAuthenticate();
        Toast.show({
          type: 'error',
          text1: 'Please try again by reopening the app',
        });
      });
  };

  async function disconnectWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      const response = await getApiData(
        BaseSetting.endpoints.googleDisconnect,
        'POST',
        { token: accessToken, type: 'google' },
        '',
        false,
      );
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: response?.message,
        });
        dispatch(setGoogleAttached(false));
        GoogleSignin.signOut();
      } else {
        Toast.show({
          type: 'error',
          text1: response?.message,
        });
      }
    } catch (error) {
      console.log('error while disconnect with google =======>>>', error);
    }
  }

  //logout api integration
  const logoutApi = async () => {
    setConfirmLoading(true);
    try {
      const params = {
        platform: Platform.OS === 'ios' ? 'ios' : 'android',
        uuid: fcmToken,
      };
      const response = await getApiData(
        BaseSetting.endpoints.logout,
        'POST',
        params,
        '',
        false,
      );
      if (response?.status) {
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
        await logout();
        setShowSignOutConfirmation(false);
      } else {
        Toast.show({
          text1: response?.message.toString(),
          type: 'error',
        });
      }
      setConfirmLoading(false);
    } catch (error) {
      Toast.show({
        text1: error?.toString(),
        type: 'error',
      });
      console.log('error while posting comment =======>>>', error);
      setConfirmLoading(false);
    }
  };
  useEffect(() => {
    fetchSportsData();
  }, []);

  const fetchSportsData = async () => {
    try {
      const endpoint = BaseSetting.endpoints.sportActiveList;
      const response = await getApiData(`${endpoint}`, 'GET');

      if (response?.status) {
        setSportsList(response?.data);
      } else {
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching sports data:', error);
      return null;
    }
  };
  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode
            ? BaseColors.lightBlack
            : BaseColors.lightBg,
        },
      ]}
    >
      <HeaderBar
        HeaderText={'Profile'}
        HeaderCenter
        leftText={editHistory ? 'Close' : ''}
        leftBtnPress={() => {
          setEditHistory(false);
          setRightHistoryText('Edit');
        }}
        rightComponent={
          activeTab?.id === 'detail' || activeTab?.id === 'history' ? (
            <TouchableOpacity
              activeOpacity={BaseSetting.buttonOpacity}
              style={{ padding: 5 }}
              onPress={() => {
                if (rightHistoryText === 'Edit') {
                  setEditHistory(true);
                  setRightHistoryText('Save');
                } else if (activeTab?.id === 'detail') {
                  profileRef?.current?.HandleDetailUpdateBtn();
                } else {
                  historyRef?.current?.HandleDetailUpdateBtn();
                }
              }}
            >
              <Text
                style={{
                  color: darkmode ? BaseColors.white : BaseColors.black90,
                }}
              >
                {rightHistoryText}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ padding: 5 }}> </Text>
          )
        }
      />

      {/* SWITCH TAB */}

      <View
        style={[
          styles.tabBox,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
      >
        <TabSwitch
          threePack
          tabs={switchOptions}
          activeTab={activeTab}
          onTabChange={currentTab => {
            setActiveTab(currentTab);
          }}
          subTabSize={BaseSetting.nWidth * 0.3}
        />
      </View>

      <KeyboardAvoidingView
        behavior={IOS ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}
      >
        {activeTab?.id === 'detail' ? (
          rightHistoryText === 'Wait...' ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MainLoader />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 10,
              }}
              bounces={false}
            >
              <View style={styles.cardOuter}>
                {editHistory === true ? (
                  <Profiledetailcomponent
                    ref={profileRef}
                    onPress={editHistory}
                    onSuccess={() => {
                      setEditHistory(false);
                      setRightHistoryText(
                        rightHistoryText !== 'Edit' && 'Wait...',
                      );
                      setTimeout(() => {
                        setRightHistoryText(
                          rightHistoryText === 'Edit' ? 'Save' : 'Edit',
                        );
                      }, 2000);
                    }}
                  />
                ) : (
                  <View style={styles.alignSetup}>
                    <InfoCard
                      data={patientdata}
                      mainTitle={'Patient Information'}
                    />
                    <InfoCard
                      data={contactdata}
                      mainTitle={'Contact Information'}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
          )
        ) : activeTab?.id === 'history' ? (
          <ProfilehistoryButton
            ref={historyRef}
            editHistory={editHistory}
            handleSuccess={() => {
              setEditHistory(false);
              setRightHistoryText('Edit');
            }}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.cardOuter}>
              <InfoCard
                data={settingData}
                mainTitle={'Settings'}
                SwitchChange={(item, v) => {
                  item.slug === 'dark_theme'
                    ? dispatch(setDarkmode(v))
                    : item.slug === 'face_id' && v
                    ? checkBiometrics()
                    : checkBiometrics();
                }}
                tabPress={item => {
                  if (
                    item?.slug === 'touch_id' ||
                    item?.slug === 'dark_theme' ||
                    item.slug === 'face_id'
                  ) {
                    return null;
                  } else if (item?.slug === 'google_connect') {
                    if (item?.title === 'Disconnect With Google') {
                      disconnectWithGoogle();
                    } else {
                      signIn();
                    }
                  } else if (item?.slug === 'apple_connect') {
                    if (item?.title === 'Disconnect With Apple') {
                      signOutWithApple();
                    } else {
                      signInWithApple();
                    }
                    signOutWithApple();
                  } else if (item?.slug === 'sign_out') {
                    setShowSignOutConfirmation(true); // Show the confirmation modal
                  } else {
                    if (item.navto === 'ResetPassword') {
                      navigation.navigate(item.navto, { from: 'profile' });
                    } else {
                      navigation.navigate(item.navto);
                    }
                  }
                }}
              />
              <InfoCard
                data={legal}
                mainTitle={'Legal & Regulatory'}
                tabPress={item => {
                  navigation.navigate(item.navto);
                }}
              />
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <View style={styles.modalHead}>
                      <Text style={styles.titleText}>Select Option</Text>
                      <TouchableOpacity
                        activeOpacity={BaseSetting.buttonOpacity}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                        }}
                        style={styles.closeicon}
                      >
                        <Icon
                          name="close"
                          size={20}
                          color={BaseColors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dropdownContainer}>
                      <Dropdown
                        items={items}
                        open={open}
                        setOpen={setOpen}
                        placeholder="Please select validation type"
                        value={value}
                        setValue={setValue}
                        // onValueChange={handleDropdownChange}
                      />
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                animationType="slide"
                transparent={true}
                visible={showSignOutConfirmation}
                onRequestClose={() => {
                  setShowSignOutConfirmation(false);
                }}
              >
                <View style={styles.confirmmmodalcenteredView}>
                  <View
                    style={[
                      styles.confirmmmodalView,
                      {
                        backgroundColor: darkmode
                          ? BaseColors.textColor
                          : BaseColors.white,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.confirmmodaltitleText,
                        {
                          color: darkmode
                            ? BaseColors.white
                            : BaseColors.black90,
                        },
                      ]}
                    >
                      Are you sure?
                    </Text>
                    <Text
                      style={[
                        styles.confirmmodalText,
                        {
                          color: darkmode ? BaseColors.white : BaseColors.black,
                        },
                      ]}
                    >
                      You want to sign out?
                    </Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.button, styles.confirmButton]}
                        onPress={async () => {
                          // Perform asynchronous actions (e.g., logout)
                          try {
                            await GoogleSignin.signOut();
                            logoutApi();
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                        disabled={confirmLoading} // Disable button while loading
                      >
                        {confirmLoading ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <Text style={styles.buttonText}>Confirm</Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={BaseSetting.buttonOpacity}
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => {
                          setShowSignOutConfirmation(false);
                        }}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Additional Sports</Text>
            <View style={styles.additionalSportsContainer}>
              {/* Render additional sports list here */}
              {userData.sport_ids.slice(2).map(id => (
                <View key={id} style={styles.sportItem}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.list}>{getSportName(id)}</Text>
                </View>
              ))}
            </View>
            <Button
              title="Close"
              onPress={() => setShowModal(false)}
              round
              style={{ width: '90%', marginTop: 20 }}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
