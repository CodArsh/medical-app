import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '@screens/Authentication/styles';
import HeaderBar from '@components/HeaderBar';
import { CheckBox } from 'react-native-elements';
import Dropdown from '@components/Dropdown';
import { BaseColors } from '@config/theme';
import Button from '@components/Button';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { getApiData } from '@utils/apiHelper';
import Authentication from '@redux/reducers/auth/actions';
import BaseSetting from '@config/setting';
import { useSelector, useDispatch } from 'react-redux';
const AuthenticationFactor = ({ navigation }) => {
  const [check, setCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState(userData?.two_factor_type);
  const { userData, darkmode } = useSelector(state => {
    return state.auth;
  });
  const { setUserData } = Authentication;
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(userData?.two_factor_type);
    setCheck(
      userData?.two_factor_enabled ? userData?.two_factor_enabled : false,
    );
  }, [userData]);

  // types of authentication
  const authData = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
  ];

  // authntication api integration
  const authCall = async () => {
    setLoader(true);
    if (!value && check) {
      Toast.show({
        text1: 'Please select authentication type',
        type: 'error',
      });
      setLoader(false);
    } else {
      const updatedUserData = {
        ...userData,
        two_factor_type: value?.toString(),
        two_factor_enabled: check ? 1 : 0,
      };
      let endPoints = BaseSetting.endpoints.authentication;
      const params = {
        type: value?.toString(),
        status: check ? 1 : 0,
      };
      try {
        const resp = await getApiData(endPoints, 'POST', params, {}, false);
        if (resp?.status) {
          Toast.show({
            text1: resp?.message?.toString(),
            type: 'success',
          });
          dispatch(setUserData(updatedUserData));
          navigation.goBack();
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
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <HeaderBar
        leftText="Back"
        leftBtnPress={() => {
          navigation.goBack();
        }}
        HeaderText={'Two Factor Authentication'}
        HeaderCenter
      />
      <View style={styles.insideBox}>
        <View>
          <View
            style={[
              styles.cart,
              {
                borderWidth: 1,
                borderColor: darkmode
                  ? BaseColors.lightGrey
                  : BaseColors.black10,
              },
            ]}
          >
            <CheckBox
              containerStyle={{
                backgroundColor: darkmode
                  ? BaseColors.black10
                  : BaseColors.white,
                borderWidth: 1,
                borderColor: darkmode
                  ? BaseColors.lightGrey
                  : BaseColors.black10,
              }}
              textStyle={{
                color: darkmode ? BaseColors.white : BaseColors.textColor,
              }}
              title={'Activate 2FA ?'}
              checked={check}
              onPress={() => setCheck(!check)}
            />
            <Text
              style={[
                styles.text,
                {
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                },
              ]}
            >
              Two-factor authentication (2FA) adds an additional layer of
              security to your account.This helps protect your account from
              unauthorized access, even if your password is compromised.
            </Text>
          </View>

          <View style={{ marginBottom: 25 }} />
          {check && (
            <View style={styles.dropBox}>
              <Dropdown
                items={authData}
                open={open}
                setOpen={setOpen}
                placeholder="Select authentication type"
                value={value}
                setValue={setValue}
              />
            </View>
          )}
        </View>

        <View style={styles.btnContainer}>
          <Button
            disabled={value === 'email' || 'phone' ? false : true}
            shape="round"
            title={'Save'}
            style={styles.save}
            onPress={authCall}
            loading={loader}
          />
        </View>
      </View>
    </View>
  );
};

export default AuthenticationFactor;
