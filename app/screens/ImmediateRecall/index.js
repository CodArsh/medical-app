import { View, Text, StatusBar, ScrollView, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import { Image } from 'react-native';
import { Images } from '@config';
import Button from '@components/Button';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';

const ImmediateRecall = ({ navigation, route }) => {
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
        HeaderText={'Immediate Recall'}
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
            Next we will test your memory. When the test begins, a list of words
            will appear on the screen. Remember these words.{'\n'} {'\n'}On the
            response screen, tap the microphone and repeat back as many words as
            you can remember, in any order.{'\n'}
            {'\n'} For Trials 2 & 3 you will see the same list again. Repeat
            back as many words as you can remember in any order, even if you
            said the word before.
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
          {/* <Image source={Images.emoji5} resizeMode="contain" /> */}
          <Image
            source={Images.rememberword}
            resizeMode="contain"
            style={styles.img2}
          />
          <Image
            source={Images.speech}
            resizeMode="contain"
            style={styles.img2}
          />
          <Image
            source={Images.typetobox}
            resizeMode="contain"
            style={styles.img2}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            shape="round"
            title={'Next'}
            onPress={() => {
              navigation.navigate('Wordlist', {
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

export default ImmediateRecall;
