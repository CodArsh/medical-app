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
import Dropdown from '@components/Dropdown';
import { useState } from 'react';
import { items } from '@config/staticData';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { getApiData } from '@utils/apiHelper';
import LabeledInput from '@components/LabeledInput';
import { isEmpty, isNull } from 'lodash';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';

const errObj = {
  p_phoneErr: false,
  p_phoneErrMsg: '',
};

const TwofactorEnabled = ({ navigation }) => {
  const { darkmode } = useSelector(state => state.auth);
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [patientPhone, setPatientPhone] = useState('');
  const [ErrObj, setErrObj] = useState(errObj);
  const IOS = Platform.OS === 'ios';

  const { userData } = useSelector(state => {
    return state.auth;
  });

  // generate OTP
  const generateOTP = async () => {
    setLoader(true);
    let endPoints = BaseSetting.endpoints.enable2FA;
    const params = {
      value: value === 'Email' ? userData?.email : patientPhone,
      type: value === 'Email' ? 'email' : 'phone',
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
          email: userData?.email,
          phone: patientPhone,
          medium: value,
          from: 'tfa',
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

  const Validation = () => {
    const error = { ...ErrObj };
    setError(false);
    let Valid = true;

    if ((isEmpty(patientPhone) || isNull(patientPhone)) && value === 'Phone') {
      Valid = false;
      error.p_phoneErr = true;
      error.p_phoneErrMsg = 'Enter phone number';
    } else if (patientPhone.length !== 10 && value === 'Phone') {
      Valid = false;
      error.p_phoneErr = true;
      error.p_phoneErrMsg = 'Phone number is not 10 digits long';
      // Phone number is not 10 digits long
    }

    if (!value) {
      Valid = false;
      setError(true);
    }

    if (Valid) {
      generateOTP();
    }
    setErrObj(error);
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
          <Image
            source={Images.twofa}
            resizeMode="contain"
            style={styles.imgStyle}
          />
        </View>
        <View style={styles.dropdownContainer}>
          <View style={styles.genderBox}>
            <Dropdown
              items={items}
              open={open}
              setOpen={setOpen}
              placeholder="Please Select 2FA Medium"
              value={value}
              setValue={setValue}
              onOpen={() => setError(false)}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>
              Please select a validation type
            </Text>
          )}
          {value === 'Phone' && (
            <View style={{ marginTop: 20 }}>
              <LabeledInput
                phoneicon
                maxLength={10}
                keyboardType="numeric"
                placeholder={'Enter phone number'}
                value={patientPhone}
                onChangeText={val => {
                  setPatientPhone(val);
                  setErrObj(old => {
                    return {
                      ...old,
                      p_phoneErr: false,
                      p_phoneErrMsg: '',
                    };
                  });
                }}
                showError={ErrObj.p_phoneErr}
                errorText={ErrObj.p_phoneErrMsg}
              />
            </View>
          )}
          <View style={styles.btnContainer}>
            <Button
              shape="round"
              title={'Enabled Two Factor'}
              style={styles.button}
              onPress={Validation}
              loading={loader}
            />
            <TouchableOpacity activeOpacity={BaseSetting.buttonOpacity}>
              <Text
                style={styles.skip}
                onPress={() => {
                  navigation.reset({
                    routes: [{ name: 'Home' }],
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

export default TwofactorEnabled;
