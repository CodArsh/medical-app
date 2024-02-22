import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
const InsideNotification = ({ route }) => {
  const { darkmode } = useSelector(state => state.auth);
  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <HeaderBar HeaderText={'Notification'} HeaderCenter leftText={'Back'} />
      <View
        style={[
          styles.card,
          {
            borderWidth: 1,
            borderColor: darkmode ? BaseColors.textColor : BaseColors.textColor,
          },
        ]}
      >
        <Text
          style={[
            styles.date,
            { color: darkmode ? BaseColors.white : BaseColors.textColor },
          ]}
        >
          Date : {moment(route?.params?.id?.createdAt).format('MM-DD-YYYY')}
        </Text>
        <Text
          style={[
            styles.title,
            { color: darkmode ? BaseColors.white : BaseColors.textColor },
          ]}
        >
          {route?.params?.id?.title}
        </Text>
        <Text
          style={[
            styles.message,
            { color: darkmode ? BaseColors.white : BaseColors.textColor },
          ]}
        >
          {route?.params?.id?.message}
        </Text>
      </View>
    </View>
  );
};

export default InsideNotification;
