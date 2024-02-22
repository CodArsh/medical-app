import Button from '@components/Button';
import HeaderBar from '@components/HeaderBar';
import BaseSetting from '@config/setting';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { View, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';
import { CheckBox } from 'react-native-elements';
import LabeledInput from '@components/LabeledInput';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { isArray, isEmpty, isNull, isUndefined } from 'lodash';
import CText from '@components/CText';
import MainLoader from '@components/MainLoader';

const errorObj = {
  treatmentErr: false,
  treatmentMsg: '',
  descriptionErr: false,
  descriptionMsg: '',
};
export default function ChangeInfo({ navigation, route }) {
  const IOS = Platform.OS === 'ios';
  const data = route?.params?.otherData;
  const { userData, darkmode } = useSelector(state => state.auth);
  const [selectedValues, setSelectedValues] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const eventId = route?.params?.event_id;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [otherResponse, setOtherResponse] = useState('');
  const [err, setErr] = useState('');
  const [errObj, setErrObj] = useState(errorObj);

  const handleOtherResponseChange = text => {
    setErrObj({
      ...errObj,
      treatmentErr: false,
      treatmentMsg: '',
    });
    setOtherResponse(text);
  };

  useEffect(() => {
    QuestionListAPI();
  }, []);

  // this function is used for get a question list
  const QuestionListAPI = async (type, list) => {
    setLoader(true);
    const endPoint = `${
      BaseSetting.endpoints.questionList
    }?event_type=${'4'}&list=${'a' || ''}&patient_id=${userData?.id || ''}
    }`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      console.log('TCL: QuestionListAPI -> res', res);
      if (res?.status) {
        if (!isEmpty(res?.data) && isArray(res?.data)) {
          setQuestionList(res?.data);
          response?.data.forEach(que => {
            if (que?.type === '8') {
              selectedValues[que?.meta_name] = que?.answer;
              if (que?.meta_name?.toLowerCase() === 'add_other_ther') {
                selectedValues['add_other_ther'] = isEmpty(que?.answer)
                  ? false
                  : true;
                setOtherResponse(!isEmpty(que?.answer) ? que?.answer : '');
              }
              if (
                que?.meta_name?.toLowerCase() === 'add_none_ther' &&
                !que?.answer
              ) {
                selectedValues['add_ther_comm'] =
                  que?.related_questions[0].answer || null;
              }
            }
          });
          setLoader(false);
        }
      } else {
        setQuestionList([]);
      }
      setLoader(false);
    } catch (error) {
      console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
      setLoader(false);
    }
  };

  // this function is used for get a questions answer
  function getAnswerTreatmentInfo(
    mainAnswer,
    questionIndex,
    relatedQuestions,
    relatedInd,
    relatedAns,
  ) {
    setQuestionList(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      if (
        mainAnswer &&
        updatedQuestions[questionIndex]?.meta_name?.toLowerCase() ===
          'add_none_ther'
      ) {
        // Uncheck "add_none_ther" checkbox when others are checked
        updatedQuestions.forEach(que => {
          if (que?.type === '8') {
            selectedValues[que?.meta_name?.toLowerCase()] = false; // Uncheck other checkboxes
          }
        });
        selectedValues['add_none_ther'] = mainAnswer || false;
        selectedValues['add_ther_comm'] = '';
      } else {
        if (mainAnswer) {
          // Uncheck "add_none_ther" when other checkboxes are checked
          updatedQuestions.forEach(que => {
            if (que?.type === '8' && (questionIndex === 6 || !que?.answer)) {
              selectedValues[que?.meta_name?.toLowerCase()] = false; // Uncheck other checkboxes
            } else {
              selectedValues['add_none_ther'] = false;
            }
          });
          selectedValues[
            updatedQuestions[questionIndex]?.meta_name.toLowerCase()
          ] = mainAnswer;
        } else {
          selectedValues[
            updatedQuestions[questionIndex]?.meta_name.toLowerCase()
          ] = mainAnswer;
          if (
            updatedQuestions[questionIndex]?.meta_name.toLowerCase() ===
            'add_other_ther'
          ) {
            setOtherResponse('');
          }
          if (!mainAnswer && !isUndefined(relatedQuestions)) {
            let key =
              relatedQuestions[relatedInd]?.metric_name ||
              relatedQuestions[relatedInd]?.meta_name.toLowerCase();
            selectedValues[key] = relatedAns;
          }
        }
      }

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answer: mainAnswer,
        error: false,
      };
      return updatedQuestions;
    });
  }

  // this function is used for validation
  function treatmentInfoValidation() {
    const error = { ...errObj };
    let valid = questionList?.some(question => {
      if (
        question?.type === '8' &&
        (question?.answer || !isEmpty(question?.answer))
      ) {
        return true;
      }
      return false;
    });

    if (!valid) {
      setErr('Please select at least one treatment');
    }

    if (selectedValues['add_other_ther'] && isEmpty(otherResponse)) {
      valid = false;
      error.treatmentErr = true;
      error.treatmentMsg = 'Please enter other treatment';
    }

    if (
      !selectedValues['add_none_ther'] &&
      isEmpty(selectedValues['add_ther_comm'])
    ) {
      valid = false;
      error.descriptionErr = true;
      error.descriptionMsg = 'Please enter description';
    }

    setErrObj(error);

    if (valid) {
      submitData();
    }
  }

  const submitData = async () => {
    setBtnLoader(true);
    let endPoints = BaseSetting.endpoints.createTreatmentInfo;
    selectedValues['event_id'] = eventId;
    selectedValues['created_from'] = 'app';
    selectedValues['add_other_ther'] = !isEmpty(otherResponse)
      ? otherResponse
      : false;
    try {
      const resp = await getApiData(
        endPoints,
        'POST',
        selectedValues,
        {},
        false,
      );

      if (resp?.status) {
        Toast.show({
          text1: resp?.message.toString(),
          type: 'success',
        });
        if (data.symptom_inventory === 0) {
          navigation.navigate('Symptom', {
            event_id: eventId,
            otherData: data,
          });
        }
      } else {
        Toast.show({
          text1: resp?.message,
          type: 'error',
        });
      }
      setBtnLoader(false);
    } catch (error) {
      Toast.show({
        text1: error?.toString(),
        type: 'error',
      });
      console.log('ERRRRR', error);
      setBtnLoader(false);
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
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkmode ? BaseColors.textColor : BaseColors.lightBg,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={BaseColors.white} />

      <HeaderBar
        HeaderText={'Treatment Information'}
        HeaderCenter
        leftText={'Cancel'}
        leftBtnPress={() => {
          navigation.goBack();
        }}
      />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={IOS ? 'padding' : ''}
          style={[
            styles.mainDiv,
            {
              backgroundColor: darkmode
                ? BaseColors.lightBlack
                : BaseColors.white,
            },
          ]}
        >
          {loader ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MainLoader />
            </View>
          ) : (
            <View style={styles.buttoncontainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {!isEmpty(questionList) &&
                  isArray(questionList) &&
                  questionList.map((item, index) => (
                    <View key={item.id}>
                      {item?.type === '6' ? (
                        <CText
                          title={item.question}
                          required
                          style={{ marginBottom: 5 }}
                          textColor={{
                            color: darkmode
                              ? BaseColors.white
                              : BaseColors.textColor,
                          }}
                        />
                      ) : item?.type === '8' ? (
                        <View>
                          <CheckBox
                            containerStyle={{
                              borderRadius: 12,
                              marginLeft: 0,
                            }}
                            title={item.question}
                            checked={selectedValues[item?.meta_name] || false}
                            onPress={() => {
                              setErrObj(errorObj);
                              getAnswerTreatmentInfo(
                                isUndefined(item?.answer) ||
                                  !selectedValues[
                                    item?.meta_name.toLowerCase()
                                  ] ||
                                  selectedValues[
                                    item?.meta_name.toLowerCase()
                                  ] === 'false'
                                  ? true
                                  : false,
                                index,
                              );
                              setErr('');
                            }}
                          />
                        </View>
                      ) : null}
                      {item?.meta_name === 'add_none_ther' && !isEmpty(err) ? (
                        <Text style={styles.errorText}>{err}</Text>
                      ) : (
                        ''
                      )}
                      {item?.meta_name?.toLowerCase() === 'add_none_ther' &&
                        selectedValues['add_other_ther'] && (
                          <>
                            <TextInput
                              style={[
                                styles.inputBar,
                                {
                                  borderColor: darkmode
                                    ? BaseColors.white
                                    : BaseColors.black30,
                                  color: darkmode
                                    ? BaseColors.white
                                    : BaseColors.textColor,
                                },
                              ]}
                              multiline
                              isRequired
                              Label={'Other treatment'}
                              LabledTextStyle={styles.textInput}
                              placeholder="Please enter other treatment"
                              placeholderTextColor={
                                darkmode
                                  ? BaseColors.white
                                  : BaseColors.textColor
                              }
                              onChangeText={handleOtherResponseChange}
                              value={otherResponse}
                            />
                            {errObj.treatmentErr && (
                              <Text style={styles.errorText}>
                                {errObj.treatmentMsg}
                              </Text>
                            )}
                          </>
                        )}
                      {!isNull(item?.related_questions) &&
                        !isUndefined(item?.related_questions) &&
                        !isEmpty(item?.related_questions) &&
                        item?.related_questions?.map((rItem, ind) => {
                          if (!selectedValues[item?.meta_name?.toLowerCase()]) {
                            return (
                              <TextInput
                                style={[
                                  styles.inputBar,
                                  {
                                    borderColor: darkmode
                                      ? BaseColors.white
                                      : BaseColors.black30,
                                    color: darkmode
                                      ? BaseColors.white
                                      : BaseColors.textColor,
                                    textAlignVertical: 'top',
                                  },
                                ]}
                                isRequired
                                multiline
                                numberOfLines={4}
                                Label={rItem?.question}
                                LabledTextStyle={styles.textInput}
                                placeholder="Please enter description"
                                placeholderTextColor={
                                  darkmode
                                    ? BaseColors.white
                                    : BaseColors.textColor
                                }
                                onChangeText={text => {
                                  getAnswerTreatmentInfo(
                                    item?.type === '8'
                                      ? selectedValues[
                                          item?.meta_name?.toLowerCase()
                                        ] || false
                                      : item?.answer,
                                    index,
                                    item?.related_questions,
                                    ind,
                                    text,
                                  );
                                  setErrObj({
                                    ...errObj,
                                    descriptionErr: false,
                                    descriptionMsg: '',
                                  });
                                }}
                                value={
                                  selectedValues[
                                    rItem?.meta_name?.toLowerCase()
                                  ]
                                }
                              />
                            );
                          }
                        })}
                    </View>
                  ))}
                {errObj.descriptionErr && (
                  <Text style={styles.errorText}>{errObj.descriptionMsg}</Text>
                )}
              </ScrollView>
              <View style={styles.btnContainer}>
                <Button
                  shape="round"
                  title={'Next'}
                  onPress={() => {
                    treatmentInfoValidation();
                    Keyboard.dismiss();
                  }}
                  loading={btnLoader}
                />
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
