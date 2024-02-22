import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import LabeledInput from '@components/LabeledInput';
import Button from '@components/Button';
import { Images } from '@config';
import BaseSetting from '@config/setting';
import { Platform } from 'react-native';
import { getApiData } from '@utils/apiHelper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BaseColors } from '@config/theme';
import { useSelector } from 'react-redux';
import { isNull, isUndefined } from 'lodash';

const ForgetPassword = ({ navigation }) => {
  const { darkmode } = useSelector(state => state.auth);
  const IOS = Platform.OS === 'ios';
  const emailRegex = BaseSetting?.emailRegex;

  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [loader, setLoader] = useState(false);

  const [emailErrObj, setEmailErrObj] = useState({ error: false, msg: '' });
  const [phoneErrObj, setPhoneErrObj] = useState({ error: false, msg: '' });

  // generate OTP
  const generateOTP = async () => {
    setLoader(true);
    let endPoints = BaseSetting.endpoints.generateOtp;
    const params = {
      value: selectedOption === 'first' ? email : phone,
      type: selectedOption === 'first' ? 'email' : 'phone',
    };
    try {
      const resp = await getApiData(endPoints, 'POST', params, {}, false);
      if (resp?.status) {
        Toast.show({
          text1: resp?.message.toString(),
          type: 'success',
          visibilityTime: 10000,
          autoHide: true,
        });
        navigation.navigate(
          'OTP',
          selectedOption === 'first'
            ? {
                email: email,
                from: 'forget',
                medium: 'Email',
              }
            : {
                phone: phone,
                from: 'forget',
                medium: 'phone',
              },
        );
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

    if (selectedOption === 'first') {
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
    } else {
      // validate phone
      if (isNull(phone) || isUndefined(phone)) {
        valid = false;
        setPhoneErrObj({
          error: true,
          msg: 'Please enter phone number',
        });
      } else {
        setPhoneErrObj({
          error: false,
          msg: '',
        });
      }
    }
    if (valid) {
      generateOTP();
    }
  }

  const CustomRadioButton = ({ label, value, checked, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(value)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.radioTop}>
            {checked && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: BaseColors.primary,
                }}
              />
            )}
          </View>
          <Text
            style={[
              { color: darkmode ? BaseColors.white : BaseColors.black90 },
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const [selectedOption, setSelectedOption] = useState('first');

  const handlePress = value => {
    setSelectedOption(value);
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
        <View style={styles.contentView}>
          <Image
            source={Images.logo}
            resizeMode="contain"
            style={{ height: 55, width: '90%' }}
            tintColor={BaseColors.primary}
          />
        </View>
        <View style={styles.container2}>
          <View style={styles.optionsContainer}>
            <CustomRadioButton
              label="Email"
              value="first"
              checked={selectedOption === 'first'}
              onPress={handlePress}
            />
            <CustomRadioButton
              label="Phone"
              value="second"
              checked={selectedOption === 'second'}
              onPress={handlePress}
            />
          </View>
        </View>
        <View style={styles.inputcontainer}>
          {selectedOption === 'first' ? (
            <>
              <LabeledInput
                loginSide
                mailicon
                placeholder={'Enter Email'}
                value={email}
                onChangeText={val => {
                  setEmail(val);
                  setEmailErrObj({ error: false, msg: '' });
                }}
                showError={emailErrObj.error}
                errorText={emailErrObj.msg}
              />
            </>
          ) : (
            <>
              <LabeledInput
                loginSide
                phoneicon
                placeholder={'Enter Phone number'}
                value={phone}
                onChangeText={val => {
                  setPhone(val);
                  setPhoneErrObj({ error: false, msg: '' });
                }}
                showError={phoneErrObj.error}
                errorText={phoneErrObj.msg}
              />
            </>
          )}
          <View style={styles.btnContainer}>
            <Button
              shape="round"
              title={'Send OTP'}
              style={styles.sendemail}
              onPress={validation}
              loading={loader}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 30,
            }}
            activeOpacity={BaseSetting.buttonOpacity}
          >
            <Text style={styles.forgotPasswordTextStyle}> Back To Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPassword;
