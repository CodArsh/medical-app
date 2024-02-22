import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
  Text,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';
import LabeledInput from '@components/LabeledInput';
import Button from '@components/Button';
import { Images } from '@config';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Authentication from '@redux/reducers/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { removeCredentials, storeCredentials } from '@utils/CommonFunction';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';

const ResetPassword = ({ navigation, route }) => {
  const { setUserData, setAccessToken, setBiometric } = Authentication;
  const { darkmode } = useSelector(state => {
    return state.auth;
  });
  const IOS = Platform.OS === 'ios';
  const from = route?.params?.from || '';
  const isPassword = route?.params?.isPassword || '';
  const email = route?.params?.email || '';
  const token = route?.params?.token || '';
  const dispatch = useDispatch();
  const cInputRef = useRef();

  const [setpassword, setSetpassword] = useState('');
  const [retypepassword, setRetypepassword] = useState('');
  const [currentpassword, setCurrentpassword] = useState('');
  const [loader, setLoader] = useState(false);

  const [passErrObj, setPassErrObj] = useState({ error: false, msg: '' });
  const [currentErrObj, setCurrentErrObj] = useState({ error: false, msg: '' });
  const [RetypepassErrObj, setRetypepassErrObj] = useState({
    error: false,
    msg: '',
  });

  useEffect(() => {
    setPassErrObj({ error: false, msg: '' });
    setRetypepassErrObj({ error: false, msg: '' });
  }, []);

  // Reset OTP
  const resetPass = async () => {
    setLoader(true);
    let endPoints =
      from === 'profile'
        ? BaseSetting.endpoints.changePassword // from OTP screen
        : isPassword
        ? BaseSetting.endpoints.createPassword
        : BaseSetting.endpoints.resetPassword; // from Profile to change password
    let params = {};
    if (from !== 'profile') {
      params = {
        password: retypepassword,
        token: token,
      };
    } else {
      params = {
        currentPassword: currentpassword,
        newPassword: retypepassword,
        confirmPassword: retypepassword,
      };

      if (isPassword) {
        params = { ...params, email: email };
      }
    }

    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        dispatch(setBiometric(false));
        removeCredentials();
        Toast.show({
          text1: resp?.message,
          type: 'success',
        });
        from === 'profile'
          ? navigation.goBack()
          : navigation.reset({
              routes: [
                {
                  name: 'Login',
                  params: {
                    email: email,
                  },
                },
              ],
            });
      } else {
        Toast.show({
          text1: resp?.message,
          type: 'error',
        });
      }
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

  // create OTP
  const createPass = async () => {
    setLoader(true);
    let endPoints = BaseSetting.endpoints.createPassword;
    const params = {
      current_password: currentpassword,
      new_password: setpassword,
      confirm_password: retypepassword,
      email: email,
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        storeCredentials(email, retypepassword);
        navigation.reset({
          routes: [{ name: IOS ? 'FaceidEnabled' : 'TwofactorEnabled' }],
        });
        dispatch(setUserData(resp?.data?.userData?.personal_info));
        dispatch(setAccessToken(resp?.data?.auth_token));
      } else {
        Toast.show({
          text1: resp?.message,
          type: 'error',
        });
      }
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

  function validation() {
    let valid = true;

    if (from === 'tfa' || from === 'profile') {
      if (currentpassword == '') {
        valid = false;
        setCurrentErrObj({
          error: true,
          msg: 'Please enter current password',
        });
      } else {
        setCurrentErrObj({
          error: false,
          msg: '',
        });
      }
    }

    // validate pass
    if (setpassword == '') {
      valid = false;
      setPassErrObj({
        error: true,
        msg: 'Please enter password',
      });
    } else if (setpassword.length < 8 || setpassword.length > 15) {
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

    // validate retypepassword
    if (retypepassword == '') {
      valid = false;
      setRetypepassErrObj({
        error: true,
        msg: 'Please enter retype password',
      });
    } else if (retypepassword.length < 8 || retypepassword.length > 15) {
      valid = false;
      setRetypepassErrObj({
        error: true,
        msg: 'Password length must be of 8-15',
      });
    } else if (retypepassword !== setpassword) {
      valid = false;
      setRetypepassErrObj({
        error: true,
        msg: 'Retype password must same as set password ',
      });
    } else {
      setRetypepassErrObj({
        error: false,
        msg: '',
      });
    }

    if (valid) {
      from === 'tfa' ? createPass() : resetPass();
    }
  }

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
      {from === 'profile' && (
        <HeaderBar
          HeaderText={'Change Password'}
          HeaderCenter
          leftText="Back"
          leftBtnPress={() => {
            navigation.goBack();
          }}
        />
      )}

      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: 20,
          marginTop: 25,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {from !== 'profile' ? (
          <View style={styles.contentView}>
            <Image
              source={Images.logo}
              resizeMode="contain"
              style={styles.img}
              tintColor={BaseColors.primary}
            />
          </View>
        ) : null}

        <ScrollView style={styles.inputcontainer}>
          {(from === 'tfa' || from === 'profile') && (
            <LabeledInput
              Label={'Current Password'}
              keyicon
              placeholder={'Enter Current Password'}
              eyePassword
              value={currentpassword}
              onChangeText={val => {
                setCurrentpassword(val);
                setCurrentErrObj({ error: false, msg: '' });
              }}
              showError={currentErrObj.error}
              errorText={currentErrObj.msg}
            />
          )}
          <LabeledInput
            Label={'Set Password'}
            LabledInputStyle={{
              marginTop: from === 'tfa' || from === 'profile' ? 20 : 0,
            }}
            keyicon
            placeholder={'Enter New Password'}
            eyePassword
            returnKeyType="next"
            value={setpassword}
            onChangeText={val => {
              setSetpassword(val);
              setPassErrObj({ error: false, msg: '' });
            }}
            showError={passErrObj.error}
            errorText={passErrObj.msg}
          />
          <LabeledInput
            ref={cInputRef}
            Label={'Retype Password'}
            LabledInputStyle={{ marginTop: 20 }}
            keyicon
            value={retypepassword}
            placeholder={'Retype Password'}
            eyePassword
            onChangeText={val => {
              setRetypepassword(val);
              setRetypepassErrObj({ error: false, msg: '' });
            }}
            showError={RetypepassErrObj.error}
            errorText={RetypepassErrObj.msg}
            onSubmitEditing={validation}
          />
          <View style={styles.btnContainer}>
            <Button
              shape="round"
              title={'Save'}
              style={styles.save}
              onPress={validation}
              loading={loader}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
