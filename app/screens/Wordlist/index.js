import Button from '@components/Button';
import HeaderBar from '@components/HeaderBar';
import BaseSetting from '@config/setting';
import { BaseColors } from '@config/theme';
import React, { useEffect, useRef, useState } from 'react';
import { getApiData } from '@utils/apiHelper';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
  BackHandler,
} from 'react-native';
import styles from './styles';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { isEmpty } from 'lodash';

export default function Wordlist({ navigation, route }) {
  const DATA = route?.params?.otherData;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const eventId = DATA?.event_id;
  const { darkmode } = useSelector(state => state.auth);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [optionList, setOptionList] = useState([]);
  const [viewType, setViewType] = useState('list');
  const [counter, setCounter] = useState(1);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const [timer1, setTimer1] = useState(0);
  const [timer2, setTimer2] = useState(0);
  const [timer3, setTimer3] = useState(0);
  const [isSpeak, setIsSpeak] = useState(false);
  const IOS = Platform.OS === 'ios';

  const InputRef1 = useRef();
  const InputRef2 = useRef();
  const InputRef3 = useRef();
  const InputRef4 = useRef();
  const InputRef5 = useRef();

  // three attempts structure
  const current_voice_attempt = {
    voiceInput1: input1 ? input1 : '',
    voiceInput2: input2 ? input2 : '',
    voiceInput3: input3 ? input3 : '',
    voiceInput4: input4 ? input4 : '',
    voiceInput5: input5 ? input5 : '',
  };
  const [answers, setAnswers] = useState([]);
  const [webId, setWebId] = useState();

  useEffect(() => {
    QuestionListAPI();
  }, []);

  // display the questions list
  const QuestionListAPI = async () => {
    const endPoint = `${BaseSetting.endpoints.questionList}?event_type=6&list=a`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        setWebId(res?.data[1]?.word_set_id);
        setOptionList(res?.data[1]?.options);
      }
    } catch (error) {
      console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
    }
  };

  // handle counter after click on next
  const handleVoice = () => {
    setInput1('');
    setInput2('');
    setInput3('');
    setInput4('');
    setInput5('');
    setViewType('voice');
  };
  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = () => {
      console.log('Speech started');
    };

    Voice.onSpeechRecognized = e => {
      console.log('Speech recognized', e);
    };

    Voice.onSpeechResults = e => {
      const recognized = e.value[0];
      setRecognizedText(recognized);
      console.log('Speech results', recognized);
      setIsSpeak(true);
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
    };

    Voice.onSpeechError = e => {
      console.log('Speech error', e);
    };

    return () => {
      // Clean up event listeners
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error('Error starting voice recognition', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.destroy();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping voice recognition', e);
    }
  };

  const words = recognizedText.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // ===== NOTE :- DON'T REMOVE THIS CODE (it's for future update) =====
  const capitalizedFirstFiveWords = capitalizedWords
    .slice(0, 5)
    .join(' ')
    .replace(/\s+/g, '\n');

  // handle 5 inputs with space key
  const handleKeyPressFirstInput = e => {
    if (e.nativeEvent.key === ' ' || e.nativeEvent.key === ',') {
      InputRef2.current.focus();
    }
  };
  const handleKeyPressSecondInput = e => {
    if (e.nativeEvent.key === ' ' || e.nativeEvent.key === ',') {
      InputRef3.current.focus();
    } else if (e.nativeEvent.key === 'Backspace' && input2?.length === 0) {
      InputRef1.current.focus();
    }
  };
  const handleKeyPressThirdInput = e => {
    if (e.nativeEvent.key === ' ' || e.nativeEvent.key === ',') {
      InputRef4.current.focus();
    } else if (e.nativeEvent.key === 'Backspace' && input3?.length === 0) {
      InputRef2.current.focus();
    }
  };
  const handleKeyPressFourthInput = e => {
    if (e.nativeEvent.key === ' ' || e.nativeEvent.key === ',') {
      InputRef5.current.focus();
    } else if (e.nativeEvent.key === 'Backspace' && input4?.length === 0) {
      InputRef3.current.focus();
    }
  };
  const handleKeyPressFifthInput = e => {
    if (e.nativeEvent.key === ' ' || e.nativeEvent.key === ',') {
    } else if (e.nativeEvent.key === 'Backspace' && input5.length === 0) {
      InputRef4.current.focus();
    }
  };

  // set input text in fields
  const inputTextIntegration = () => {
    if (input1?.length === 0) {
      setInput1(words[0]);
      setInput2(words[1]);
      setInput3(words[2]);
      setInput4(words[3]);
      setInput5(words[4]);
    } else if (input2?.length === 0) {
      setInput2(words[0]);
      setInput3(words[1]);
      setInput4(words[2]);
      setInput5(words[3]);
    } else if (input3?.length === 0) {
      setInput3(words[0]);
      setInput4(words[1]);
      setInput5(words[2]);
    } else if (input4?.length === 0) {
      setInput4(words[0]);
      setInput5(words[1]);
    } else if (input5?.length === 0) {
      setInput5(words[0]);
    } else {
      // when all fields are filled
      return null;
    }
    setIsSpeak(false);
  };

  // object data stored in array
  const pushOperation = e => {
    answers.push({
      trial: e === 1 ? 'trial_1' : e === 2 ? 'trial_2' : 'trial_3',
      user_response:
        current_voice_attempt.voiceInput1 +
        ', ' +
        current_voice_attempt.voiceInput2 +
        ', ' +
        current_voice_attempt.voiceInput3 +
        ', ' +
        current_voice_attempt.voiceInput4 +
        ', ' +
        current_voice_attempt.voiceInput5,
      score: e === 1 ? timer1 * 1000 : e === 2 ? timer2 * 1000 : timer3 * 1000,
    });
  };

  // handle all voice & list attempts
  const handleAttempts = () => {
    if (counter < 3) {
      setViewType('list');
    }
    if (counter === 1) {
      pushOperation(counter);
      setCounter(2);
    } else if (counter === 2) {
      pushOperation(counter);
      setCounter(3);
    } else if (counter === 3) {
      pushOperation(counter);

      // final call
      createCallApi();
    }
    setRecognizedText('');
    setInput1('');
    setInput2('');
    setInput3('');
    setInput4('');
    setInput5('');
    setIsListening(false);
  };

  // count the attemps
  const CounterTag = () => {
    return (
      <View style={styles.counterTag}>
        <Text
          style={[
            styles.subtitleText,
            {
              color: darkmode ? BaseColors.white : BaseColors.textColor,
            },
          ]}
        >
          {` Trial ${counter} / 3`}
          {'\n'}What do you remember?{'\n'}
        </Text>
      </View>
    );
  };

  // api integration for create call
  const createCallApi = async () => {
    try {
      const paramsArray = answers?.map((item, index) => ({
        fix_aoi: 12,
        viewed: 12,
        fix_dur_aoi: 12,
        fix_screen: 12,
        dur_screen: item.score,
        user_response: item.user_response,
        trial: item.trial,
      }));
      const data = {
        event_id: eventId,
        word_set_id: webId,
        answers: JSON.stringify(paramsArray),
        created_from: 'app',
      };
      const response = await getApiData(
        BaseSetting.endpoints.createCall,
        'POST',
        data,
        '',
        false,
      );
      if (response?.status) {
        DATA.digit_recall === 0
          ? navigation.navigate('ImmediateRecallmain', {
              event_id: eventId,
              otherData: DATA,
            })
          : navigation.navigate('Comment', {
              event_id: eventId,
              otherData: DATA,
            });
        Toast.show({
          text1: response?.message.toString(),
          type: 'success',
        });
      } else {
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
    } catch (error) {
      console.log('error =======>>>', error);
    }
  };
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
  useEffect(() => {
    let intervalId;
    if (viewType === 'voice') {
      if (counter === 1) {
        intervalId = setInterval(() => {
          setTimer1(prevTimer => prevTimer + 1);
        }, 1000);
      } else if (counter === 2) {
        intervalId = setInterval(() => {
          setTimer2(prevTimer => prevTimer + 1);
        }, 1000);
      } else if (counter === 3) {
        intervalId = setInterval(() => {
          setTimer3(prevTimer => prevTimer + 1);
        }, 1000);
      }
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [viewType]);

  const [showConfirmation, setShowConfirmation] = useState(false);

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
        {viewType === 'list' ? (
          <View
            style={{
              flex: 1,
              backgroundColor: darkmode
                ? BaseColors.lightBlack
                : BaseColors.lightBg,
            }}
          >
            <HeaderBar
              HeaderText={'Word List'}
              HeaderCenter
              leftText={'Cancel'}
              leftBtnPress={() => {
                navigation.goBack();
              }}
            />

            <View
              style={[
                styles.mainDiv,
                {
                  backgroundColor: darkmode
                    ? BaseColors.black
                    : BaseColors.white,
                },
              ]}
            >
              <View style={{ flex: 0.2 }}>
                <Text
                  style={[
                    styles.subtitleText,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                >
                  Trial {+1}/3{'\n'}Remember these words{'\n'}
                </Text>
                <Text
                  style={[
                    styles.optionList,
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                >
                  {optionList.map(item => item + '\n')}
                </Text>
              </View>
              <View style={styles.btnContainer}>
                <Button
                  shape="round"
                  title={'Next'}
                  onPress={() => handleVoice()}
                />
              </View>
            </View>
          </View>
        ) : (
          <View>
            <HeaderBar
              HeaderText={'Voice Input'}
              HeaderCenter
              leftText={'Cancel'}
              leftBtnPress={() => {
                navigation.goBack();
              }}
            />
            <View
              style={[
                styles.mainDiv,
                {
                  backgroundColor: darkmode
                    ? BaseColors.black
                    : BaseColors.white,
                },
              ]}
            >
              <CounterTag />
              {isSpeak && inputTextIntegration()}
              {/* textarea */}
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  flex: 0.5,
                }}
              >
                <TextInput
                  ref={InputRef1}
                  style={[
                    styles.voiceInput1,
                    {
                      backgroundColor: darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                    },
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                  value={
                    input1
                      ? input1.charAt(0).toUpperCase() + input1.slice(1)
                      : input1
                  }
                  onChangeText={setInput1}
                  onKeyPress={handleKeyPressFirstInput}
                />
                <TextInput
                  ref={InputRef2}
                  style={[
                    styles.voiceInput2,
                    {
                      backgroundColor: darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                    },
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                  value={
                    input2
                      ? input2.charAt(0).toUpperCase() + input2.slice(1)
                      : input2
                  }
                  onChangeText={setInput2}
                  onKeyPress={handleKeyPressSecondInput}
                  onFocus={() =>
                    isEmpty(input1) ? InputRef1.current.focus() : null
                  }
                />
                <TextInput
                  ref={InputRef3}
                  style={[
                    styles.voiceInput3,
                    {
                      backgroundColor: darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                    },
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                  value={
                    input3
                      ? input3.charAt(0).toUpperCase() + input3.slice(1)
                      : input3
                  }
                  onChangeText={setInput3}
                  onKeyPress={handleKeyPressThirdInput}
                  onFocus={() =>
                    isEmpty(input1)
                      ? InputRef1.current.focus()
                      : isEmpty(input2)
                      ? InputRef2.current.focus()
                      : null
                  }
                />
                <TextInput
                  ref={InputRef4}
                  style={[
                    styles.voiceInput4,
                    {
                      backgroundColor: darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                    },
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                  value={
                    input4
                      ? input4.charAt(0).toUpperCase() + input4.slice(1)
                      : input4
                  }
                  onChangeText={setInput4}
                  onKeyPress={handleKeyPressFourthInput}
                  onFocus={() =>
                    isEmpty(input1)
                      ? InputRef1.current.focus()
                      : isEmpty(input2)
                      ? InputRef2.current.focus()
                      : isEmpty(input3)
                      ? InputRef3.current.focus()
                      : null
                  }
                />
                <TextInput
                  ref={InputRef5}
                  style={[
                    styles.voiceInput5,
                    {
                      marginBottom: 20,
                      backgroundColor: darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                    },
                    {
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                    },
                  ]}
                  value={
                    input5
                      ? input5.charAt(0).toUpperCase() + input5.slice(1)
                      : input5
                  }
                  onChangeText={setInput5}
                  onKeyPress={handleKeyPressFifthInput}
                  onFocus={() =>
                    isEmpty(input1)
                      ? InputRef1.current.focus()
                      : isEmpty(input2)
                      ? InputRef2.current.focus()
                      : isEmpty(input3)
                      ? InputRef3.current.focus()
                      : isEmpty(input4)
                      ? InputRef4.current.focus()
                      : null
                  }
                />
                <TouchableOpacity
                  onPress={isListening ? stopListening : startListening}
                  style={[
                    styles.borderVoice,
                    {
                      borderColor: darkmode ? null : BaseColors.black10,
                      borderWidth: darkmode ? null : 1,
                      backgroundColor: darkmode
                        ? BaseColors.lightBlack
                        : BaseColors.white,
                      elevation: darkmode ? 0 : 2,
                    },
                  ]}
                >
                  <Icon
                    size={65}
                    name="microphone"
                    color={isListening ? BaseColors.red : BaseColors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.textInputVoice}
                  onPress={() => {
                    stopListening();
                    setRecognizedText('');
                    setInput1('');
                    setInput2('');
                    setInput3('');
                    setInput4('');
                    setInput5('');
                  }}
                >
                  <Text
                    style={{
                      color: darkmode ? BaseColors.white : BaseColors.primary,
                      fontSize: 14,
                    }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.attemptBtn}>
                <Button
                  onPress={handleAttempts}
                  shape="round"
                  title={
                    counter === 1
                      ? 'Second Attempt'
                      : counter === 2
                      ? 'Third Attempt'
                      : 'Submit'
                  }
                  style={styles.nextBtn}
                />
              </View>
            </View>
          </View>
        )}
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
                    disabled={confirmLoading}
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
