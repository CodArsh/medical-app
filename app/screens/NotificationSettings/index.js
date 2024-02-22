import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import { CheckBox } from 'react-native-elements';
import Dropdown from '@components/Dropdown';
import BaseSetting from '@config/setting';
import Button from '@components/Button';
import style from '@screens/EventDetails/style';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { getApiData } from '@utils/apiHelper';

const NotificationSettings = ({ navigation }) => {
  const { darkmode } = useSelector(state => {
    return state.auth;
  });
  const [check, setCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [loader, setLoader] = useState(false);

  // types of authentication
  const authData = [
    { label: 'before 1 hour', value: 60 },
    { label: 'before 45 minutes', value: 45 },
    { label: 'before 30 minutes', value: 30 },
    { label: 'before 15 minutes', value: 15 },
  ];

  useEffect(() => {
    setLoader(false);
  }, []);

  // authntication api integration
  const reminder = async () => {
    setLoader(true);
    if (!value && check) {
      Toast.show({
        text1: 'Please select notification time',
        type: 'error',
      });
      setLoader(false);
    } else {
      let endPoints = BaseSetting.endpoints.notificationSetting;
      const params = {
        remind: check ? '1' : '0',
        timing: check ? value : null,
      };
      try {
        const resp = await getApiData(endPoints, 'POST', params, {}, false);
        if (resp?.status) {
          Toast.show({
            text1: resp?.message?.toString(),
            type: 'success',
          });
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
        HeaderText={'Notification Setting'}
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
              title={'Notification Time'}
              checked={check}
              onPress={() => setCheck(!check)}
            />
          </View>

          <View style={{ marginBottom: 25 }} />
          {check && (
            <View style={styles.dropBox}>
              <Dropdown
                items={authData}
                open={open}
                setOpen={setOpen}
                placeholder="Select notification time"
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
            onPress={reminder}
            loading={loader}
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationSettings;
