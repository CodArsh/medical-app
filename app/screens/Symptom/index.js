import { View, Text, ScrollView, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import Button from '@components/Button';
import { Image } from 'react-native';
import { Images } from '@config';
import { BaseColors } from '@config/theme';
import HeaderBar from '@components/HeaderBar';
import { useSelector } from 'react-redux';

const Symptom = ({ navigation, eventId, route }) => {
  const data = route?.params?.otherData;
  const { darkmode } = useSelector(state => state.auth);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    // setShowConfirmation(true);
    navigation.navigate('Events');
    return true;
  };

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <HeaderBar
        HeaderText={'Symptoms'}
        HeaderCenter
        leftText={'Back'}
        leftBtnPress={() => {
          handleBackPress();
        }}
      />
      <ScrollView
        style={[
          styles.scrollViewStyle,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.titleText,
              { color: darkmode ? BaseColors.white : BaseColors.black },
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
            Please report your symptom severity level based on how you typically
            feel, using the provided scale.
          </Text>
          <Text
            style={[
              styles.titlesubText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            Please report your symptom severity level, based on how you feel at
            this point, using the provided scale.{'\n'}
            {'\n'}Please report your symptom severity level, based on how you've
            felt over the past 24 hours or since your last assessment, using the
            provided scale. Your most recent severity level is shown for each
            symptom.{'\n'}
          </Text>
          <Text
            style={[
              styles.titleText,
              { color: darkmode ? BaseColors.white : BaseColors.black },
            ]}
          >
            Example:
          </Text>
          <View style={styles.imgContainer}>
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
              navigation.navigate('Symptoms', {
                event_id: eventId,
                otherData: data,
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Symptom;
