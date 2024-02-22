/* eslint-disable react-native/no-inline-styles */
import LabeledInput from '@components/LabeledInput';
import BaseSetting from '@config/setting';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import { isArray, isEmpty, isNumber, isUndefined } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import styles from './styles';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import MainLoader from '@components/MainLoader';

const errorObj = {
  otherErr: false,
  otherMsg: '',
  descErr: false,
  descMg: '',
};

const ProfilehistoryButton = (props, ref) => {
  const { darkmode, userData } = useSelector(state => state.auth);
  const isFocused = useIsFocused();
  const { editHistory, handleSuccess } = props;
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [other, setOther] = useState('');
  console.log('other =======>>>', other);
  const [errObj, setErrObj] = useState(errorObj);

  useEffect(() => {
    QuestionListAPI();
    setOther('');
  }, [isFocused, editHistory]);

  useImperativeHandle(ref, () => ({
    HandleDetailUpdateBtn: () => {
      validation();
    },
  }));

  function setInitialData(QuestionArr) {
    const dummy_obj = {};
    isArray(QuestionArr) &&
      !isEmpty(QuestionArr) &&
      QuestionArr.map(item => {
        if (!isEmpty(item?.answer) || isNumber(item?.answer)) {
          // if (item?.meta_name === 'other_ther') {
          //   setOther(item?.answer == 0 ? '' : item?.answer);
          // }
          if (item?.parent_meta_name?.toLowerCase()) {
            QuestionArr.map(item1 => {
              if (
                item?.parent_meta_name?.toLowerCase() ===
                  item1?.meta_name?.toLowerCase() &&
                item1?.answer != 0
              ) {
                dummy_obj[item?.meta_name?.toLowerCase()] = item?.answer;
              } else if (
                item?.parent_meta_name?.toLowerCase() === 'none_ther' &&
                item?.meta_name?.toLowerCase() === 'prev_ther_comm' &&
                item1?.answer == 0
              ) {
                dummy_obj[item?.meta_name?.toLowerCase()] = item?.answer;
              }
            });
          } else {
            dummy_obj[item?.meta_name?.toLowerCase()] = item?.answer;
          }
        }
      });
    setData(dummy_obj);
  }

  const QuestionListAPI = async () => {
    const endPoint = `${BaseSetting.endpoints.question}?type=app`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        setQuestionList(res?.data);
        setInitialData(res?.data);
      } else {
        Toast.show({
          text1: res?.message,
          type: 'error',
        });
        Toast.setQuestionList([]);
      }
      setLoader(false);
    } catch (error) {
      console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
      setLoader(false);
    }
  };

  function getAnswer(ans, questionIndex) {
    const dummy_Arr = [...questionList];
    dummy_Arr.map((item, index) => {
      if (index === questionIndex) {
        item.answer = ans;
        item.error = false;
      }
    });
    setInitialData(dummy_Arr);
    setQuestionList(dummy_Arr);
  }

  function validation() {
    const dummy_Arr = [...questionList];
    let valid = true;
    let checkBoxErr = false;

    dummy_Arr.map(question => {
      // Check if main answer is not selected
      if (question?.parent_meta_name?.toLowerCase()) {
        dummy_Arr.map(item => {
          if (
            question?.parent_meta_name?.toLowerCase() ===
              item?.meta_name?.toLowerCase() &&
            item?.answer
          ) {
            if (
              !isEmpty(question?.answer) ||
              isNumber(question?.answer) ||
              question?.type === '6' ||
              question?.type === '8' ||
              question?.parent_meta_name?.toLowerCase() == 'none_ther'
            ) {
              question.error = false;
            } else {
              question.error = true;
              valid = false; // Set valid to false if any main question has an error
            }
          }
        });
      } else if (
        !isEmpty(question?.answer) ||
        isNumber(question?.answer) ||
        question?.type === '6' ||
        question?.type === '8' ||
        question?.parent_meta_name?.toLowerCase() === 'none_ther'
      ) {
        question.error = false;
      } else {
        question.error = true;
        valid = false; // Set valid to false if any main question has an error
      }
    });

    setQuestionList(dummy_Arr);
    checkBoxErr = questionList.some(item => {
      if (item?.type === '8') {
        return item?.answer;
      }
    });
    if (valid) {
      if (checkBoxErr) {
        let subValid = true;
        const error = { ...errObj };
        if (data['other_ther'] && isEmpty(other) && !data['none_ther']) {
          subValid = false;
          error.otherErr = true;
          error.otherMsg = 'Please enter other treatment';
        }
        if (
          !data['none_ther'] &&
          (isUndefined(data['prev_ther_comm']) ||
            isEmpty(data['prev_ther_comm']))
        ) {
          subValid = false;
          error.descErr = true;
          error.descMg = 'Please enter description';
        }
        setErrObj(error);
        if (subValid) {
          savePatientHistory();
        }
      } else {
        Toast.show({
          text1: 'Please select at least one checkbox',
          type: 'error',
        });
      }
    }
  }

  async function savePatientHistory() {
    data['other_ther'] = !isEmpty(other) ? other : 0;
    try {
      const response = await getApiData(
        BaseSetting.endpoints.savePatient,
        'POST',
        {
          patientId: userData.id,
          answers: JSON.stringify([data]),
          created_from: 'app',
        },
        '',
        false,
      );
      if (response?.status) {
        QuestionListAPI();
        handleSuccess();
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
  }

  const handleCheckBoxChange = (ans, index) => {
    setQuestionList(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      // for type === "8"
      if (ans && updatedQuestions[index]?.meta_name === 'none_ther') {
        // Uncheck "add_none_ther" checkbox when others are checked
        updatedQuestions.forEach(que => {
          if (que?.type === '8') {
            data[que?.meta_name?.toLowerCase()] = 0; // Uncheck other checkboxes
          }
        });
        data['none_ther'] = ans || 0;
        data['prev_ther_comm'] = '';
      } else {
        if (ans) {
          // Uncheck "add_none_ther" when other checkboxes are checked
          updatedQuestions.forEach(que => {
            if (que?.meta_name?.toLowerCase() === 'none_ther') {
              que.answer = 0;
            }
            if (que?.type === '8' && (index === 14 || !que?.answer)) {
              data[que?.meta_name?.toLowerCase()] = 0; // Uncheck other checkboxes
            } else {
              data['none_ther'] = 0;
            }
          });
          data[updatedQuestions[index]?.meta_name?.toLowerCase()] = ans;
        } else {
          data[updatedQuestions[index]?.meta_name?.toLowerCase()] = ans;
        }
      }

      updatedQuestions[index] = {
        ...updatedQuestions[index],
        answer: ans,
        error: false,
      };

      return updatedQuestions;
    });
  };

  const renderQuestion = (item, index, type_arr, a) => {
    return (
      <View
        key={index}
        style={[
          {
            backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
          },
        ]}
      >
        {/* Render question */}
        {item.type === '8' ? (
          editHistory ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ marginLeft: -10 }}>
                <CheckBox
                  containerStyle={{
                    borderRadius: 12,
                  }}
                  title={item.question}
                  checked={data[item.meta_name?.toLowerCase()] || false} // A boolean prop indicating whether the checkbox is checked
                  onPress={() => {
                    if (item?.meta_name?.toLowerCase() == 'none_ther') {
                      setOther('');
                    }
                    handleCheckBoxChange(
                      isUndefined(data[item?.meta_name?.toLowerCase()]) ||
                        !data[item?.meta_name?.toLowerCase()]
                        ? 1
                        : 0,
                      index,
                    );
                  }} // Use onPress instead of onChange
                />
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                }}
              >{`${item.question} : `}</Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                }}
              >
                {`${
                  item?.meta_name?.toLowerCase() === 'other_ther'
                    ? other || 'False'
                    : item?.answer == 1
                    ? 'True'
                    : 'False'
                }`}
              </Text>
            </View>
          )
        ) : (
          <Text
            style={[
              styles.questionText,
              {
                color: darkmode ? BaseColors.white : BaseColors.black,
              },
            ]}
          >
            <Icon name="arrowright" size={20} color={BaseColors.secondary} />
            &nbsp;
            {`${item.patient_question}`}
            <Text style={{ color: BaseColors.red, marginTop: -13 }}> *</Text>
          </Text>
        )}
        {/* Render answer options */}
        {item.type === '1' ? (
          // Render Yes/No buttons
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={editHistory}
            style={[{ width: '100%' }]}
          >
            {editHistory ? (
              type_arr.map((it1, ind1) => {
                return (
                  <View style={styles.buttoncontainer}>
                    <TouchableOpacity
                      onPress={() => {
                        getAnswer(it1?.value, index);
                      }}
                      style={[
                        {
                          backgroundColor:
                            item?.answer === it1?.value
                              ? BaseColors.secondary
                              : darkmode
                              ? BaseColors.textColor
                              : BaseColors.transparent,
                          borderColor: BaseColors.borderColor,
                          marginRight: 40,
                        },
                        styles.yesbutton,
                      ]}
                    >
                      <Text
                        style={{
                          color:
                            item?.answer === it1?.value
                              ? BaseColors.white
                              : darkmode
                              ? BaseColors.white
                              : BaseColors.textColor,
                        }}
                      >
                        {ind1 === 2 && item?.meta_name === 'hist_hi'
                          ? 'Unknown'
                          : it1?.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : item?.meta_name?.toLowerCase() === 'hi_recov' ? (
              [
                { label: '7 to 10 days', value: 1 },
                { label: '2 weeks to 1 month', value: 2 },
                { label: '1 to 6 months', value: 3 },
                { label: 'greater than 6 months', value: 4 },
                { label: 'still recovering', value: 5 },
              ].map(hiItem => {
                if (item?.answer == hiItem?.value) {
                  return (
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: darkmode
                          ? BaseColors.white
                          : BaseColors.textColor,
                      }}
                    >{`Ans: ${hiItem?.label}`}</Text>
                  );
                }
              })
            ) : (
              <Text
                style={{
                  fontWeight: 'bold',
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                }}
              >{`Ans: ${
                item?.answer === 1
                  ? 'Yes'
                  : item?.answer === 0
                  ? 'No'
                  : item?.answer === 2
                  ? item?.meta_name?.toLowerCase() === 'hist_hi'
                    ? 'Unknown'
                    : 'Undiagnosed'
                  : '-'
              }`}</Text>
            )}
          </ScrollView>
        ) : item.type === '2' ? (
          // Render text input for type 2
          editHistory ? (
            <LabeledInput
              placeholder="Enter your response here"
              value={item?.answer?.toString() || ''}
              onChangeText={text => {
                // Handle text input change
                getAnswer(text, index);
              }}
              keyboardType={'number-pad'}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 8,
                marginVertical: 5,
                borderRadius: 5,
              }}
            />
          ) : (
            <Text
              style={{
                fontWeight: 'bold',
                color: darkmode ? BaseColors.white : BaseColors.textColor,
              }}
            >{`Ans: ${item?.answer || '-'}`}</Text>
          )
        ) : item.meta_name?.toLowerCase() === 'other_med_hx_comm' ? (
          // Render text input for type 2
          editHistory ? (
            <TextInput
              multiline={true} // Enables multi-line input
              numberOfLines={4}
              placeholder="Enter your response here"
              value={item?.answer?.toString() || ''}
              onChangeText={text => {
                // Handle text input change
                getAnswer(text, index);
              }}
              style={[
                styles.inputBar,
                {
                  borderColor: darkmode ? BaseColors.white : BaseColors.black30,
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                  height: 100,
                },
              ]}
            />
          ) : (
            <Text
              style={{
                fontWeight: 'bold',
                color: darkmode ? BaseColors.white : BaseColors.textColor,
              }}
            >{`Ans: ${item?.answer || '-'}`}</Text>
          )
        ) : item.meta_name?.toLowerCase() === 'prev_ther_comm' ? (
          // Render another text input for type 3
          editHistory ? (
            <>
              <TextInput
                multiline={true} // Enables multi-line input
                numberOfLines={4}
                placeholder="Enter your response here"
                value={item.answer?.toString()}
                onChangeText={text => {
                  getAnswer(text, index);
                  setErrObj({ ...errObj, descErr: false, descMg: '' });
                }}
                style={[
                  styles.inputBar,
                  {
                    borderColor: darkmode
                      ? BaseColors.white
                      : BaseColors.black30,
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                    height: 100,
                  },
                ]}
              />
              {errObj.descErr ? (
                <Text
                  style={{
                    color: BaseColors.red,
                  }}
                >
                  {errObj.descMg}
                </Text>
              ) : (
                ''
              )}
            </>
          ) : (
            <Text
              style={{
                fontWeight: 'bold',
                color: darkmode ? BaseColors.white : BaseColors.textColor,
              }}
            >{`Ans: ${item?.answer || '-'}`}</Text>
          )
        ) : item.type === '4' ? (
          // Render a scale or something for type 4
          <Text>Scale</Text>
        ) : item.type === '5' ? (
          // Render buttons for type 5
          <View style={{ flexDirection: 'row' }}>
            {editHistory ? (
              ['Yes', 'No'].map((option, optionIndex) => (
                <View style={styles.buttoncontainer} key={optionIndex}>
                  <TouchableOpacity
                    onPress={() => getAnswer(optionIndex === 0 ? 1 : 0, index)}
                    style={[
                      {
                        backgroundColor:
                          (item.answer == 1 && optionIndex === 0) ||
                          (item.answer == 0 && optionIndex === 1)
                            ? BaseColors.secondary
                            : darkmode
                            ? BaseColors.textColor
                            : 'transparent',
                      },
                      styles.yesbutton,
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          (item.answer == 1 && optionIndex === 0) ||
                          (item.answer == 0 && optionIndex === 1)
                            ? BaseColors.white
                            : darkmode
                            ? BaseColors.white
                            : BaseColors.textColor,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text
                style={{
                  fontWeight: 'bold',
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                }}
              >{`Ans: ${
                item.answer == 1 ? 'Yes' : item.answer == 0 ? 'No' : '-'
              }`}</Text>
            )}
          </View>
        ) : null}

        {item.meta_name?.toLowerCase() === 'other_ther' && data['other_ther']
          ? // Render text input for type 2
            editHistory && (
              <>
                <Text
                  style={{
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  }}
                >
                  <Icon
                    name="arrowright"
                    size={20}
                    color={BaseColors.secondary}
                  />
                  &nbsp; Other treatment
                  <Text style={{ color: BaseColors.red, marginTop: -13 }}>
                    {' '}
                    *
                  </Text>
                </Text>
                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Enter other treatment"
                  value={other.toString()}
                  onChangeText={text => {
                    setOther(text);
                    setErrObj({ ...errObj, otherErr: false, otherMsg: '' });
                  }}
                  style={[
                    styles.inputBar,
                    {
                      borderColor: darkmode
                        ? BaseColors.white
                        : BaseColors.black30,
                      color: darkmode ? BaseColors.white : BaseColors.textColor,
                      maxHeight: 100,
                      height: 50,
                    },
                  ]}
                />
                {/* other treatment error message */}
                {errObj.otherErr ? (
                  <Text
                    style={{
                      color: BaseColors.red,
                    }}
                  >
                    {errObj.otherMsg}
                  </Text>
                ) : (
                  ''
                )}
              </>
            )
          : ''}
        {/* Render error message if any */}
        {item.error ? (
          <Text style={{ color: BaseColors.red, marginBottom: 5 }}>
            This question is mandatory
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleTextcontainer}>
        <Text
          style={[
            styles.titleText,
            { color: darkmode ? BaseColors.white : BaseColors.black },
          ]}
        >
          Medical History
        </Text>
      </View>
      <View
        style={[
          styles.mainDiv,

          {
            backgroundColor: darkmode ? BaseColors.black : BaseColors.white,
          },
        ]}
      >
        {loader ? (
          <View style={{ alignSelf: 'center' }}>
            <MainLoader />
          </View>
        ) : (
          // Render the main content

          <ScrollView
            contentContainerStyle={{
              backgroundColor: BaseColors.white,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            {/* Your main content */}
            {questionList.length > 0 ? (
              questionList.map((item, index) => {
                const type_arr =
                  item?.meta_name?.toLowerCase() === 'hi_recov'
                    ? [
                        { label: '7 to 10 days', value: 1 },
                        { label: '2 weeks to 1 month', value: 2 },
                        { label: '1 to 6 months', value: 3 },
                        { label: 'greater than 6 months', value: 4 },
                        { label: 'still recovering', value: 5 },
                      ]
                    : [
                        { label: 'Yes', value: 1 },
                        { label: 'No', value: 0 },
                        { label: 'Undiagnosed', value: 2 },
                      ];
                return item?.parent_meta_name?.toLowerCase()
                  ? questionList.map((itemM, indexM) => {
                      return (
                        item?.parent_meta_name?.toLowerCase() ===
                          itemM?.meta_name?.toLowerCase() &&
                        (itemM?.meta_name?.toLowerCase() === 'none_ther'
                          ? itemM?.answer == 0
                          : itemM?.answer == 1) &&
                        renderQuestion(item, index, type_arr, 1)
                      );
                    })
                  : renderQuestion(item, index, type_arr, 2);
              })
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80%',
                }}
              >
                <Text>No Data</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default forwardRef(ProfilehistoryButton);
