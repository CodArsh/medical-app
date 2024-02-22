import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';
import Button from '@components/Button';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import MainLoader from '@components/MainLoader';

export default function Recalldigits({ navigation, route }) {
  const DATA = route?.params?.otherData;
  const eventId = DATA?.event_id;
  const { darkmode } = useSelector(state => state.auth);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [userInputs, setUserInputs] = useState([]);
  const [manualInputValue, setManualInputValue] = useState('');
  const [firstInputIncorrect, setFirstInputIncorrect] = useState(false);
  const [inputError, setInputError] = useState('');
  const textInputRef = useRef(null); // Create a ref for the text input
  const [firstSetIncorrect, setFirstSetIncorrect] = useState(false);

  const [data, setData] = useState({
    event_id: eventId,
    answers: [],
    created_from: 'app',
  });

  const [inputValues, setInputValues] = useState([]);

  const IOS = Platform.OS === 'ios';

  useEffect(() => {
    if (showInput && textInputRef.current) {
      textInputRef.current.focus(); // Focus the input when it becomes visible
    }
  }, [showInput]);

  useEffect(() => {
    QuestionListAPI();
  }, []);

  const inputStartTimes = useRef([]); // Ref to store start times

  const onToggleDisplay = () => {
    if (!showInput) {
      // Start the timer when showing a digit
      inputStartTimes.current[currentIndex] = Date.now(); // Record the start time
    } else {
      if (manualInputValue === '') {
        setInputError('Please enter digits before proceeding.');
        return;
      }

      const elapsedMilliseconds =
        Date.now() - inputStartTimes.current[currentIndex];

      const answer = {
        digit: questionList[currentIndex],
        fix_aoi: 12,
        viewed: 12,
        fix_dur_aoi: 12,
        fix_screen: 12,
        dur_screen: elapsedMilliseconds,
        user_response: manualInputValue,
      };

      const updatedAnswers = [...data.answers];
      updatedAnswers[currentIndex] = answer;
      setData({ ...data, answers: updatedAnswers });

      const updatedInputs = [...userInputs];
      updatedInputs[currentIndex] = manualInputValue;
      setUserInputs(updatedInputs);

      const updatedInputValues = [...inputValues];
      updatedInputValues[currentIndex] = manualInputValue;
      setInputValues(updatedInputValues);

      setManualInputValue('');
      setInputError('');

      if (currentIndex % 2 === 0) {
        const currentItem = questionList[currentIndex];
        if (
          currentItem &&
          manualInputValue ===
            (String(currentItem).split('').reverse().join('') || '')
        ) {
          // User input is correct for the first digit in the set
          const nextIndex = currentIndex + 2; // Move to the next set

          // Update the first digit's answer
          const answer = {
            digit: currentItem,
            fix_aoi: 12,
            viewed: 12,
            fix_dur_aoi: 12,
            fix_screen: 12,
            dur_screen: elapsedMilliseconds,
            user_response: manualInputValue,
          };

          const secondDigitAnswer = {
            digit: null,
            fix_aoi: null,
            viewed: null,
            fix_dur_aoi: null,
            fix_screen: null,
            dur_screen: null,
            user_response: null,
          };

          const updatedAnswers = [...data.answers];
          updatedAnswers[currentIndex] = answer;
          updatedAnswers[currentIndex + 1] = secondDigitAnswer;
          setData({ ...data, answers: updatedAnswers });

          if (nextIndex >= questionList.length) {
            // No more sets, submit data as correct and show success message
            submitData({ ...data, answers: updatedAnswers });
            Toast.show({
              text1: 'Data submitted successfully.',
              type: 'success',
            });
          } else {
            setCurrentIndex(nextIndex);
          }
        } else {
          // User input is incorrect for the first digit
          setCurrentIndex(currentIndex + 1);
          setFirstSetIncorrect(true); // Set the flag for the first set being incorrect
        }
      } else {
        const currentItem = questionList[currentIndex];
        if (
          currentItem &&
          manualInputValue ===
            (String(currentItem).split('').reverse().join('') || '')
        ) {
          // User input is correct for the second digit in the set
          const nextIndex = currentIndex + 1; // Move to the next set

          // Update the second digit's answer
          const answer = {
            digit: currentItem,
            fix_aoi: 12,
            viewed: 12,
            fix_dur_aoi: 12,
            fix_screen: 12,
            dur_screen: elapsedMilliseconds,
            user_response: manualInputValue,
          };

          const updatedAnswers = [...data.answers];
          updatedAnswers[currentIndex] = answer;
          setData({ ...data, answers: updatedAnswers });

          if (nextIndex >= questionList.length) {
            // No more sets, submit data as correct and show success message
            submitData({ ...data, answers: updatedAnswers });
            Toast.show({
              text1: 'Data submitted successfully.',
              type: 'success',
            });
          } else {
            setCurrentIndex(nextIndex);
          }
        } else {
          // User input is incorrect for the second digit, submit data as wrong and show success message
          if (firstSetIncorrect) {
            // If the first set was incorrect, set all other sets as null objects
            for (let i = currentIndex + 1; i < questionList.length; i++) {
              const nullAnswer = {
                digit: null,
                fix_aoi: null,
                viewed: null,
                fix_dur_aoi: null,
                fix_screen: null,
                dur_screen: null,
                user_response: null,
              };
              updatedAnswers[i] = nullAnswer;
            }
          }

          submitData({ ...data, answers: updatedAnswers });
          Toast.show({
            text1: 'Data submitted successfully.',
            type: 'success',
          });
          navigation.navigate('Comment', { eventId: eventId, otherData: DATA });
        }
      }
    }

    setShowInput(!showInput);
  };

  async function submitData(val) {
    console.log('🚀 ~ file: index.js:183 ~ submitData ~ val:', val);
    try {
      val['answers'] = JSON.stringify(val.answers);
      const response = await getApiData(
        BaseSetting.endpoints.sendnumberarray,
        'POST',
        val,
        {},
        false,
      );

      if (response?.status) {
        Toast.show({
          text1: response?.message,
          type: 'success',
        });
        navigation.navigate('Comment', { eventId: eventId, otherData: DATA });
      } else {
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log('error =======>>>', error);
    }
  }

  const QuestionListAPI = async () => {
    setLoader(true);
    const endPoint = `${BaseSetting.endpoints.questionList}?event_type=7`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');

      if (res?.status) {
        setQuestionList(res?.data[1].options);
      } else {
        setQuestionList([]);
      }
      setLoader(false);
    } catch (error) {
      console.log('Error:', error);
      setLoader(false);
    }
  };
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, []);

  const handleBackPress = () => {
    setShowConfirmation(true);
    return true;
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    navigation.goBack();
  };
  // Define an array of trial text based on digit length and position
  const trialTexts = [
    '3 Digits A',
    '3 Digits B',
    '4 Digits A',
    '4 Digits B',
    '5 Digits A',
    '5 Digits B',
    '6 Digits A',
    '6 Digits B',
  ];

  // Calculate the current trial text based on the length of the current digit
  const currentTrialText = trialTexts[currentIndex] || 'Unknown Trial';
  const a = questionList[currentIndex];

  const lengthOfA = a?.toString()?.length;

  return (
    <KeyboardAvoidingView
      behavior={IOS ? 'padding' : 'height'}
      style={[
        styles.container,
        {
          backgroundColor: darkmode
            ? BaseColors.lightBlack
            : BaseColors.lightBg,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HeaderBar
          HeaderText={'Digits Backwards'}
          HeaderCenter
          leftText="Cancel"
          leftBtnPress={() => {
            handleBackPress();
          }}
        />
        <View
          style={[
            styles.mainDiv,
            {
              backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
            },
          ]}
        >
          {loader ? (
            <View style={{ alignItems: 'center' }}>
              <MainLoader />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 0.1 }}>
                <Text
                  style={[
                    styles.subtitleText,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                >
                  {currentTrialText}
                </Text>
                {showInput ? (
                  <Text
                    style={[
                      styles.subtitleText,
                      {
                        color: darkmode
                          ? BaseColors.white
                          : BaseColors.textColor,
                      },
                    ]}
                  >
                    Report backwards
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.subtitleText,
                      {
                        color: darkmode
                          ? BaseColors.white
                          : BaseColors.textColor,
                      },
                    ]}
                  >
                    Remember these numbers
                  </Text>
                )}
              </View>
              <View>
                {showInput ? (
                  <View style={{ flex: 0.1 }}>
                    <TextInput
                      autoFocus
                      ref={textInputRef} // Create a ref using useRef
                      value={manualInputValue}
                      keyboardType="numeric"
                      maxLength={
                        lengthOfA === 3
                          ? 3
                          : lengthOfA === 4
                          ? 4
                          : lengthOfA === 5
                          ? 5
                          : lengthOfA === 6
                          ? 6
                          : null
                      }
                      onChangeText={text => {
                        setManualInputValue(text);
                        setInputError(''); // Clear the error when the user starts typing
                      }}
                      // placeholder="Enter digits"
                      // placeholderTextColor={BaseColors.black20}
                      style={[
                        styles.numbercontainer,
                        {
                          color: darkmode
                            ? BaseColors.white
                            : BaseColors.textColor,
                        },
                      ]}
                    />

                    {inputError && (
                      <Text
                        style={[
                          styles.errorTxt,
                          {
                            color: darkmode
                              ? BaseColors.white
                              : BaseColors.textColor,
                          },
                        ]}
                      >
                        {inputError}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View>
                    <View style={styles.numbercontainer}>
                      <Text
                        style={[
                          styles.titleText,
                          {
                            color: darkmode
                              ? BaseColors.white
                              : BaseColors.textColor,
                          },
                        ]}
                      >
                        {questionList[currentIndex]}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          <View>
            {(currentIndex === questionList.length - 1) & showInput ? (
              <Button
                shape="round"
                title={'Submit'}
                onPress={onToggleDisplay}
              />
            ) : showInput ? (
              <Button
                shape="round"
                title={'Submit'}
                onPress={onToggleDisplay}
              />
            ) : (
              <Button shape="round" title={'Next'} onPress={onToggleDisplay} />
            )}
          </View>
        </View>
        {showConfirmation && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmation}
            onRequestClose={handleCancel}
          >
            <View style={styles.confirmationModalCenteredView}>
              <View
                style={[
                  styles.confirmationModalView,
                  {
                    backgroundColor: darkmode
                      ? BaseColors.textColor
                      : BaseColors.white,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.confirmationModalTitleText,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.black,
                    },
                  ]}
                >
                  Are you sure?
                </Text>
                <Text
                  style={[
                    styles.confirmationModalText,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.black,
                    },
                  ]}
                >
                  You want to leave this screen?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleConfirm}
                    // disabled={confirmLoading}
                  >
                    {confirmLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
