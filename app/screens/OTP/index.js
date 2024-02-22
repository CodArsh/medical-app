import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import styles from './styles';
import Button from '@components/Button';
import { Images } from '@config';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Authentication from '@redux/reducers/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { storeCredentials } from '@utils/CommonFunction';
import { BaseColors } from '@config/theme';
import BackgroundTimer from 'react-native-background-timer';

export default function OTP({ navigation, route }) {
  const { fcmToken, darkmode } = useSelector(state => state.auth);
  const email = route?.params?.email || '';
  const phone = route?.params?.phone || '';
  const medium = route?.params?.medium || '';
  const password = route?.params?.password || '';
  const from = route?.params?.from || '';
  const checked = route?.params?.checked || 0;
  const [timer, setTimer] = useState(60);
  const [clearInput, setClearInput] = useState(false);
  const [resend, setResend] = useState(false);
  useEffect(() => {
    if (timer > 0) {
      BackgroundTimer.start();
      const interval = BackgroundTimer.setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => BackgroundTimer.clearInterval(interval);
    }
  }, [timer, resend]);

  useEffect(() => {
    if (timer === 0) {
      setResend(true);
    }
  }, [timer]);

  const generateOTP = async () => {
    setResend(false);
    setLoader(true);
    let endPoints = BaseSetting.endpoints.generateOtp;
    const params = {
      value: email,
      type: 'email',
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        setTimer(60);
        Toast.show({
          text1: resp?.message?.toString(),
          type: 'success',
          visibilityTime: 10000,
          autoHide: true,
        });
      } else {
        setCode('');
        setClearInput(true); // Clear the OTP input fields
        Toast.show({
          text1: resp?.message,
          type: 'error',
        });
      }
      setLoader(false);
    } catch (error) {
      setCode('');
      setClearInput(true); // Clear the OTP input fields
      Toast.show({
        text1: error?.toString(),
        type: 'error',
      });
      console.log('ERRRRR', error);
      setLoader(false);
    }
    setClearInput(false);
  };

  const dispatch = useDispatch();

  const { setUserData, setAccessToken } = Authentication;
  const [code, setCode] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!isEmpty(code)) {
      verifyOTP();
    }
  }, [code]);

  const renderInputField = (index, isSelected) => {
    const inputStyle = {
      color: 'red',
    };

    return (
      <TextInput
        key={`input-field-${index}`}
        style={inputStyle}
        editable={!clearInput}
      />
    );
  };

  const verifyOTP = async () => {
    setLoader(true);
    let endPoints = BaseSetting.endpoints.verifyOtp;
    const params = {
      value: medium === 'Email' ? email : phone,
      type: from === 'tfa' ? '2FA' : 'forgot-password',
      parameterType: medium === 'Email' ? 'email' : 'phone',
      otp: code,
      uuid: fcmToken,
      checked: checked ? 1 : 0,
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        if (from === 'tfa') {
          storeCredentials(email, password);
          dispatch(setUserData(resp?.data?.personal_info));
          dispatch(setAccessToken(resp?.data?.auth_token));
          navigation.reset({
            routes: [{ name: 'Home' }],
          });
          dispatch({ type: 'socket/connect' }); // connect
        } else {
          navigation.navigate('ResetPassword', {
            from: 'forget',
            token: resp?.data?.otp_token,
          });
        }
      } else {
        setCode('');
        setOtpInputValue('');
        setClearInput(true);
        Toast.show({
          text1: resp?.message,
          type: 'error',
        });
      }
      setLoader(false);
    } catch (error) {
      setOtpInputValue('');
      setClearInput(true);
      Toast.show({
        text1: error?.toString(),
        type: 'error',
      });
      console.log('ERRRRR', error);
      setLoader(false);
    }
    setClearInput(false);
  };
  const [otpInputValue, setOtpInputValue] = useState('');
  const handleCodeFilled = () => {
    Keyboard.dismiss();
    setOtpInputValue('');
    setClearInput(true);
  };
  useEffect(() => {
    if (clearInput) {
      setClearInput(false);
    }
  }, [clearInput]);
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
      <View
        style={{
          justifyContent: 'center',
          flex: 0.55,
          alignItems: 'center',
        }}
      >
        <Image
          source={Images.logo}
          resizeMode="contain"
          style={{ marginBottom: 10, height: 55, width: '90%' }}
          tintColor={BaseColors.primary}
        />
      </View>

      <View style={{ height: 100, marginVertical: 25 }}>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: darkmode ? BaseColors.white : BaseColors.black90,
            }}
          >
            Code has sent to
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: darkmode ? BaseColors.white : BaseColors.black90,
            }}
          >
            {medium === 'email' ? email : phone}
            {from === 'forget' ? email : null}
          </Text>
        </View>
        <OTPInputView
          pinCount={6}
          editable
          clearInputs={clearInput}
          onCodeChanged={value => setOtpInputValue(value)}
          code={otpInputValue}
          autoFocusOnLoad
          codeInputFieldStyle={[
            styles.underlineStyleBase,
            { color: darkmode ? BaseColors.white : BaseColors.black90 },
          ]}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => {
            setCode(code);
            handleCodeFilled();
          }}
          inputTextStyle={{ color: 'red' }}
          renderInputField={renderInputField}
        />
      </View>
      <Button
        shape="round"
        title={'Verify OTP'}
        style={styles.otpBtn}
        onPress={verifyOTP}
        loading={loader}
      />
      <View style={styles.resend}>
        <TouchableOpacity
          disabled={!resend ? true : false}
          onPress={() => resend && generateOTP()}
        >
          <Text
            style={{
              color: darkmode ? BaseColors.white : BaseColors.black90,
            }}
          >
            Resent OTP {!resend && `: 00:${timer}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
