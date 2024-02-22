/* eslint-disable */
import React from 'react';
import { View, StatusBar, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';
import { Images } from '@config';
import Button from '@components/Button';
import { useSelector } from 'react-redux';

export default function Success() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { darkmode } = useSelector(state => state.auth);
  return (
    <View
      style={[
        styles.main,
        {
          // backgroundColor: caliStatus ? BaseColors.borderColor : '#0005',
          backgroundColor: darkmode ? '#58595A' : BaseColors.white,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        backgroundColor={'#0000'}
        barStyle="light-content"
        translucent={true}
      />
      <HeaderBar
        HeaderText={''}
        isTransperant
        HeaderCenter
        leftText="Cancel"
        leftBtnPress={() => {
          navigation.goBack();
          navigation.goBack();
        }}
        LeftTextStyle={{ color: BaseColors?.white }}
        HeaderTextStyle={{ color: BaseColors?.white }}
      />
      <View style={styles.successOuter}>
        <Image source={Images?.success} style={styles.successImg} />
        <View style={styles.textOuter}>
          <Text
            style={[
              styles.successText,
              { color: darkmode ? BaseColors.white : BaseColors.textGrey },
            ]}
          >
            This assessment will take approximately 8-10 minutes. In order to
            get the most acurate results, please complete the assessment in a
            single setting without interruption. Answer each question to the
            best of your ability.
          </Text>
          <Text
            style={[
              styles.successText,
              { color: darkmode ? BaseColors.white : BaseColors.textGrey },
            ]}
          >
            You will have the opportunity to share any important
            information/feedback with your provider at the end of this
            assessment.
          </Text>
        </View>
        <Button
          title={'Begin Assessment'}
          style={styles.btnStyle}
          onPress={() => {
            navigation?.navigate('Symptoms', { event_id: 126 });
          }}
        />
      </View>
    </View>
  );
}
