import { View, Text, StatusBar, ScrollView, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import { Image } from 'react-native';
import { Images } from '@config';

import Button from '@components/Button';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';

const ImmediateRecallmain = ({ navigation, route }) => {
  const data = route?.params?.otherData;
  const { darkmode } = useSelector(state => state.auth);
  const eventId = route?.params?.event_id;
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
        HeaderText={'Digits Backwards'}
        // leftText={'Cancel'}
        // leftBtnPress={() => {
        //   navigation.navigate('Events');
        // }}
        HeaderCenter
      />

      <ScrollView
        contentContainerStyle={[
          styles.topcontainer,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            style={[
              styles.titleText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            Instructions
          </Text>
          <Text
            style={[
              styles.titlesubText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            A list of numbers will appear on the screen. Remember these numbers.
            {'\n'}
            {'\n'}
            When the number pad appears, do your best to report as many numbers
            as you can remember in the exact reverse order as they appeared.
          </Text>
          <Text
            style={[
              styles.example,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            Example:{'\n'}
          </Text>
          <Text
            style={[
              styles.subText,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            If you saw{'\n'} 1 2 3 {'\n'}
            {'\n'}You would report {'\n'}3 2 1
          </Text>

          <Text
            style={[
              styles.example,
              { color: darkmode ? BaseColors.white : BaseColors.textColor },
            ]}
          >
            Example:
          </Text>
        </View>

        <View style={styles.imgcontainer}>
          <Image
            source={Images.digit}
            resizeMode="contain"
            style={styles.img2}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            shape="round"
            title={'Next'}
            onPress={() => {
              navigation?.navigate('Recalldigits', {
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

export default ImmediateRecallmain;
