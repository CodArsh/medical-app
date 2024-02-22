import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import styles from './styles';
import Button from '@components/Button';
import { Image } from 'react-native';
import { Images } from '@config';
import { BaseColors } from '@config/theme';
import HeaderBar from '@components/HeaderBar';
import { useSelector } from 'react-redux';

const Symptom = ({ navigation, eventId, handleNextPress }) => {
  const { darkmode } = useSelector(state => state.auth);
  return (
    <ScrollView style={styles.main}>
      <HeaderBar
        HeaderText={'Symptoms'}
        HeaderCenter
        leftText={'Back'}
        leftBtnPress={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          paddingTop: 30,
          flexGrow: 1,
          paddingHorizontal: 25,
          marginTop: 1,
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        }}
      >
        <View style={{ flex: 0.1 }}>
          <Text
            style={[
              styles.titleText,
              { color: darkmode ? BaseColors.white : BaseColors.black90 },
            ]}
          >
            Report your symptoms
          </Text>
          <Text
            style={[
              styles.titlesubText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            Please report your symptom severity level, based on how you've felt
            over the past 24 hours or since your last assessment, using the
            provided scale for each symptom listed on the following screens.
          </Text>
          <Text
            style={[
              styles.subtitleText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            Your previous assessment value is shown on each symptom.
          </Text>
          <Text
            style={[
              styles.titleText,
              { color: darkmode ? BaseColors.white : BaseColors.black90 },
            ]}
          >
            Example:
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Image
              source={Images.sliderimage}
              resizeMode="contain"
              style={styles.img2}
            />
          </View>
        </View>
        <View style={styles.btnContainer}>
          <Button
            shape="round"
            title={'Next'}
            style={styles.Assessment}
            onPress={() => {
              navigation.navigate('Symptoms', { event_id: eventId });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Symptom;
