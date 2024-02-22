import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style';
import HeaderBar from '@components/HeaderBar';
import TabSwitch from '@components/TabSwitch';
import { BaseColors } from '@config/theme';
import CardList from '@components/CardList';
import { useSelector } from 'react-redux';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import { Slider } from '@miblanchard/react-native-slider';
import moment from 'moment';
import EventDetailComponent from '@components/EventDetailComponent';
import { isArray, isEmpty, isNull } from 'lodash';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';

import {
  BalanceProblemsw,
  BlurredVisionw,
  Confusionw,
  DifficultyConcentratingw,
  DifficultyRememberingw,
  Dizzinessw,
  DontFeelRightw,
  Drowsinessw,
  Fatiguew,
  Feelinginafogw,
  FeelingSlowedDownsw,
  Headachew,
  Irritabilityw,
  Moreemotionalw,
  Nauseaw,
  NeckPainw,
  Nervousness_Anxiousnessw,
  PressureinHeadw,
  Sadnessw,
  SensitivitytoLightw,
  SensitivitytoNoisew,
  TroubleFallingAsleepw,
} from '@components/SVG_Bundle';
import Cutomspiderchart from '@components/Cutomspiderchart.js';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import MainLoader from '@components/MainLoader';
import NoData from '@components/NoData';

export default function EventDetails({ navigation, route }) {
  // Check if the device is a tablet
  const isTablet = DeviceInfo.isTablet();
  const scrollViewRef = useRef();
  const event_title = route?.params;
  const eventType = route?.params?.event_name;
  const [listOfAssessments, setListOfAssessments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [graph, setGraph] = useState([]);
  const [day, setDay] = useState([]);
  const [month, setMonth] = useState([]);
  const [spiderItems, setSpiderItems] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const [defaultGraph, setDefaultGraph] = useState();
  const [wrapData, setWrapData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [missedData, setMissedData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [eventDetail, setEventDetail] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);
  let eventId = route?.params?.id;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // this state is used for refresh page
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [assessmentLoad, setAssessmentLoad] = useState(false);

  let datas = route?.params;

  const { darkmode } = useSelector(state => state.auth);
  // OUTER TABS
  const switchOptions = [
    { id: 'report', name: 'Report' },
    { id: 'assessments', name: 'Assessments' },
  ];

  const [activeTab, setActiveTab] = useState({
    id: 'report',
    name: 'Report',
  });

  // INNER TABS
  const switchInOptions = [
    { id: 'summary', name: 'Summary' },
    { id: 'details', name: 'Details' },
  ];

  const [activeInTab, setActiveInTab] = useState({
    id: 'summary',
    name: 'Summary',
  });
  useEffect(() => {
    getSummary();
  }, []);
  const getSummary = async () => {
    const endPoint = `${BaseSetting.endpoints.spiderReport}?want_from=app&event_id=${eventId}`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        setDataAvailable(!isEmpty(res?.data));
        // Key and values
        const keysToProcess = Object.keys(
          res?.data.find(item => item.initial === true),
        ).slice(0, -1);

        setInit(init);
        const filteredData = keysToProcess.reduce((acc, key) => {
          if (res?.data.find(item => item.initial === true)[key] !== null) {
            acc[key] = res?.data.find(item => item.initial === true)[key];
          }
          return acc;
        }, {});
        const today = moment(new Date()).format('YYYY-MM-DD');

        const dateObj = res?.data?.filter(item => item.date === today);

        if (dateObj[0]?.assessment_id) {
          delete dateObj[0]?.assessment_id;
          delete dateObj[0]?.date;
        }

        for (const item of dateObj) {
          setModalVisible(isNull(Object.values(item)[0]?.curr_value));
          break;
        }

        const filteredObject = {};
        for (const key in filteredData) {
          if (filteredData[key] !== 0) {
            filteredObject[key] = filteredData[key];
          }
        }
        // Remove the properties
        delete filteredObject.assessment_id;
        delete filteredObject.date;
        setDefaultGraph(filteredObject);
        const newObj = res?.data.filter(
          item => !item.hasOwnProperty('initial'),
        );
        setGraph(newObj);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    let dayArr = [];
    let monthArr = [];
    if (!isEmpty(graph) && isArray(graph)) {
      graph?.forEach((item, index) => {
        dayArr.push(moment(item?.date).format('DD-MMM')?.split('-')[0]);
        monthArr.push(moment(item?.date).format('DD-MMM')?.split('-')[1]);
      });
    }
    setDay(dayArr);
    setMonth(monthArr);
    runSlider([graph?.length - 1]);
    setSliderValue([graph?.length - 1]);
  }, [graph]);

  const [init, setInit] = useState();
  const runSlider = value => {
    const date = `${day[value]} - ${month[value]}`;
    const selectedDate = date?.replace(/\s/g, '');

    let dataObj = graph?.find(item => {
      return moment(item?.date).format('DD-MMM') === selectedDate;
    });

    if (!dataObj) {
      dataObj = graph[graph.length - 1];
    }

    if (dataObj) {
      let init = dataObj['initial'];
      // Key and values
      const keysToProcess = init
        ? Object.keys(dataObj).slice(0, -1)
        : Object.keys(dataObj);
      setInit(init);
      const filteredData = keysToProcess.reduce((acc, key) => {
        if (dataObj[key] !== null) {
          acc[key] = dataObj[key];
        }
        return acc;
      }, {});

      const filteredObject = {};
      for (const key in filteredData) {
        if (filteredData[key] !== 0) {
          filteredObject[key] = filteredData[key];
        }
      }

      const result = Object.entries(filteredData).map(([label, value]) => ({
        label,
        value: value.curr_value,
      }));

      const filteredData1 = result.filter(
        item => item.label !== 'assessment_id' && item.label !== 'date',
      );

      // Create a new array in the desired format
      const transformedData = Object?.entries(filteredData)?.map(
        ([key, value]) => {
          if (key === 'assessment_id' || key === 'date') {
            return { [key]: value };
          } else {
            return {
              label: key,
              initial_value: value.initial_value,
              curr_value: value.curr_value,
            };
          }
        },
      );
      delete transformedData.assessment_id;
      delete transformedData.date;

      // Filter out "date" and "assessment_id"
      const newBundle = transformedData.filter(
        item => !item.date && !item.assessment_id,
      );

      setWrapData(newBundle);

      const convertedData = filteredData1.reduce((result, item) => {
        result[item.label] = item.value;
        return result;
      }, {});

      setSpiderItems(convertedData);
    }
  };

  // assments list
  useEffect(() => {
    getAssessments();
  }, []);
  // this function is used to get assessment data
  const getAssessments = async bool => {
    !bool && setAssessmentLoad(true);
    const endPoint = `${BaseSetting.endpoints.eventDetails}?event_id=${eventId}`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        const dueArray = [];
        const completedArray = [];
        const missingArray = [];
        res?.data?.assessments?.map((item, index) => {
          if (item.details?.status === 'Completed') {
            completedArray.push(item);
          } else if (item.details?.status === 'Pending') {
            dueArray.push(item);
          } else if (item.details?.status === 'Missed') {
            missingArray.push(item);
          }
        });
        setPendingData(dueArray);
        setCompletedData(completedArray);
        setMissedData(missingArray);
        setListOfAssessments(res?.data);
      } else {
        Toast.show({
          text1: response?.message.toString(),
          type: 'error',
        });
      }
      setAssessmentLoad(false);
      setRefreshLoader(false);
    } catch (error) {
      setAssessmentLoad(false);
      setRefreshLoader(false);
      Toast.show({
        text1: error.toString(),
        type: 'error',
      });
      console.log('Error:', error);
    }
  };

  // DETAIL TAB RELATED CODE
  useEffect(() => {
    ChartData();
  }, []);

  const ChartData = async () => {
    setLoader(true);
    const endPoint = `${BaseSetting.endpoints.zigzagReports}?want_from=app&event_id=${eventId}&metric_name=headache`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');

      if (res?.status) {
        setEventDetail(res?.data);
      } else {
        setEventDetail([]);
      }
      setLoader(false);
    } catch (error) {
      console.log('🚀 ~ file: index.js:156 ~ ChartData ~ error:', error);
      setLoader(false);
    }
  };

  function getSymptomIconComponent(symptomName) {
    const symptomIcons = {
      headache: <Headachew height={15} width={15} />,
      press_head: <PressureinHeadw height={15} width={15} />,
      neck_pain: <NeckPainw height={18} width={18} />,
      nausea: <Nauseaw height={17} width={17} />,
      dizziness: <Dizzinessw height={15} width={15} />,
      vis_prob: <BlurredVisionw height={15} width={15} />,
      balance: <BalanceProblemsw height={15} width={15} />,
      sens_light: <SensitivitytoLightw height={15} width={15} />,
      sens_noise: <SensitivitytoNoisew height={15} width={15} />,
      slow: <FeelingSlowedDownsw height={15} width={15} />,
      foggy: <Feelinginafogw height={18} width={18} />,
      not_right: <DontFeelRightw height={15} width={15} />,
      diff_concen: <DifficultyConcentratingw height={15} width={15} />,
      diff_rem: <DifficultyRememberingw height={15} width={15} />,
      fatigue: <Fatiguew height={15} width={15} />,
      confused: <Confusionw height={15} width={15} />,
      drowsy: <Drowsinessw height={15} width={15} />,
      emotional: <Moreemotionalw height={15} width={15} />,
      irritable: <Irritabilityw height={15} width={15} />,
      sad_dep: <Sadnessw height={15} width={15} />,
      nerv_anx: <Nervousness_Anxiousnessw height={15} width={15} />,
      trouble_sleep: <TroubleFallingAsleepw height={15} width={15} />,
    };

    // Check if the symptomName exists in the symptomIcons object
    if (symptomIcons.hasOwnProperty(symptomName)) {
      // Return the corresponding SVG component if found
      return symptomIcons[symptomName];
    } else {
      return null;
    }
  }
  const calculateIconColor = (prevValue, value) => {
    const diff = Math.abs(value - prevValue);

    if (diff === 0) {
      return BaseColors.black400;
    } else if (diff === 1) {
      return BaseColors.primaryBlue300;
    } else if (diff === 2) {
      return BaseColors.primaryBlue400;
    } else if (diff === 3) {
      return BaseColors.primaryBlue500;
    } else if (diff === 4) {
      return BaseColors.primaryBlue600;
    } else if (diff === 5) {
      return BaseColors.primaryBlue700;
    } else if (diff === 6) {
      return BaseColors.primaryBlue900;
    } else {
      return BaseColors.black400;
    }
  };

  const eventDescriptions = {
    headache: 'Headache',
    press_head: 'Pressure in Head',
    neck_pain: 'Neck Pain',
    nausea: 'Nausea',
    dizziness: 'Dizziness',
    vis_prob: 'Blurred Vision/Vision',
    balance: 'Balance Problem',
    sens_light: 'Sensitivity to Light',
    sens_noise: 'Sensitivity to Noise',
    slow: 'Feeling Slowed Down',
    foggy: 'Feeling like a Fog',
    not_right: "Don't Feel Right",
    diff_concen: 'Difficulty Concentrating',
    diff_rem: 'Difficulty Remembering',
    fatigue: 'Fatigue / Low Energy',
    confused: 'Confusion',
    drowsy: 'Drowsiness',
    emotional: 'More emotional',
    irritable: 'Irritability',
    sad_dep: 'Sadness',
    nerv_anx: 'Nervous / Anxiousness',
    trouble_sleep: 'Trouble Falling Asleep',
  };

  const handleattempt = () => {
    setModalVisible(false);
    pendingData[0]['details']['event_title'] =
      listOfAssessments?.event_details?.title;
    navigation.navigate('Assessment', pendingData[0]);
  };
  const hasMoreThan14Values = wrapData.length > 14;
  const sortedData = wrapData?.sort(
    (a, b) => b.initial_value - a.initial_value,
  );
  const [show, setShow] = useState(false);

  const GraphData = () => {
    setTimeout(() => {
      setShow(true);
    }, 1000);

    const handlePageChange = newPage => {
      setCurrentPage(newPage);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: (newPage - 1) * BaseSetting.nWidth,
          animated: true,
        });
      }
    };

    const renderGraph = (startIndex, endIndex) => {
      return (
        <View
          style={{
            flex: 1,
            paddingLeft: isTablet ? ScreenWidth * 0.15 : 0,
            marginBottom: isTablet ? screenHeight / 10 : 0,
          }}
        >
          <Cutomspiderchart
            data={
              hasMoreThan14Values
                ? sortedData.slice(startIndex, endIndex)
                : wrapData.slice(startIndex, endIndex)
            }
            size={isTablet ? ScreenWidth * 1.06 : ScreenWidth * 2}
            axesSvg={{ strokeWidth: 2 }}
          />
        </View>
      );
    };

    return show ? (
      <View>
        <ScrollView
          ref={scrollViewRef}
          // style={{ marginLeft: currentPage === 2 ? 1 : -10 }}
          horizontal
          pagingEnabled
          pinchGestureEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            if (scrollViewRef.current) {
              const offsetX = event.nativeEvent.contentOffset.x;
              const page = Math.ceil(offsetX / BaseSetting.nWidth) + 1;
              setCurrentPage(page);
            }
          }}
          scrollEnabled={false} // Disable scrolling
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderGraph(0, 11)}
            {renderGraph(11)}
          </View>
        </ScrollView>

        {show && (
          <View style={styles.paginationContainer}>
            {[...Array(totalPages)].map(
              (_, index) =>
                !isEmpty(graph) &&
                isArray(graph) && (
                  <TouchableOpacity
                    key={index}
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 20,
                      borderColor:
                        currentPage === index + 1
                          ? BaseColors.primary
                          : darkmode
                          ? BaseColors.white
                          : BaseColors.black90,
                      borderWidth: 1,
                      marginLeft: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handlePageChange(index + 1)}
                  >
                    <Text
                      style={[
                        styles.paginationDot,
                        {
                          backgroundColor:
                            currentPage === index + 1
                              ? BaseColors.primary
                              : darkmode
                              ? BaseColors.white
                              : BaseColors.black90,
                        },
                      ]}
                    ></Text>
                  </TouchableOpacity>
                ),
            )}
          </View>
        )}
      </View>
    ) : (
      <View
        style={{ height: BaseSetting.nHeight / 1.9, justifyContent: 'center' }}
      >
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  const totalPages = hasMoreThan14Values ? 2 : 1;

  // this function is used to refreshing a event list data
  function onRefresh() {
    getAssessments(true);
    setRefreshLoader(true);
  }
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
        HeaderText={`Event Report (${datas?.title || event_title})`}
        HeaderCenter
        leftText="Back"
      />
      {/* SWITCH TAB */}
      <View
        style={[
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.white,
          },
        ]}
      >
        <TabSwitch
          tabs={switchOptions}
          activeTab={activeTab}
          onTabChange={currentTab => {
            setActiveTab(currentTab);
          }}
        />
      </View>

      {activeTab?.id === 'report' ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 25,
              marginVertical: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: darkmode ? BaseColors.white : BaseColors.black90,
                }}
              >
                Event Type:{' '}
              </Text>
              <Text
                style={{
                  color: darkmode ? BaseColors.white : BaseColors.black90,
                }}
              >
                {eventType}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: darkmode ? BaseColors.white : BaseColors.black90,
                }}
              >
                RTA Phase:{' '}
              </Text>
              <Text
                style={{
                  color: darkmode ? BaseColors.white : BaseColors.black90,
                }}
              >
                xxxxx
              </Text>
            </View>
          </View>
          <TabSwitch
            insideTab
            tabs={switchInOptions}
            activeTab={activeInTab}
            onTabChange={currentTab => {
              setActiveInTab(currentTab);
            }}
          />
          {activeInTab.id === 'summary' ? (
            <ScrollView scrollEnabled={true}>
              {dataAvailable ? (
                <>
                  <View style={styles.spiderView}>
                    <View style={[styles.outerBox, { borderWidth: 1 }]}>
                      {GraphData()}

                      {!isEmpty(graph) && isArray(graph) && (
                        <View
                          style={[
                            {
                              backgroundColor: darkmode
                                ? BaseColors.lightBlack
                                : BaseColors.white,
                            },
                            styles.init,
                          ]}
                        >
                          <View style={styles.upper}>
                            <Text
                              style={{
                                color: darkmode
                                  ? BaseColors.white
                                  : BaseColors.black,
                              }}
                            >
                              Current&nbsp;
                            </Text>
                            <View style={styles.box1} />
                            <Text
                              style={{
                                color: darkmode
                                  ? BaseColors.white
                                  : BaseColors.black,
                              }}
                            >
                              &nbsp;&nbsp;Initial&nbsp;
                            </Text>
                            <View style={styles.box2} />
                          </View>
                        </View>
                      )}
                    </View>

                    {!isEmpty(graph) && isArray(graph) && show ? (
                      <Slider
                        value={graph?.length - 1 - sliderValue}
                        minimumValue={0}
                        maximumValue={graph?.length - 1}
                        step={1}
                        style={styles.slider}
                        thumbStyle={styles.thumbStyle}
                        thumbTintColor={
                          darkmode ? BaseColors.lightGray : BaseColors.white
                        }
                        minimumTrackTintColor={
                          darkmode ? BaseColors.primary : BaseColors.primary
                        }
                        maximumTrackTintColor={
                          darkmode
                            ? BaseColors.tabinInactive
                            : BaseColors.tabinActive
                        }
                        onValueChange={value => {
                          const reversedValue = graph?.length - 1 - value;
                          runSlider(reversedValue);
                          console.log(value);
                          setSliderValue(reversedValue);
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          top: 150,
                          left: BaseSetting.nWidth / 2 - 50,
                          position: 'absolute',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text>No Data</Text>
                      </View>
                    )}

                    {show && (
                      <>
                        <View style={styles.markerContainer}>
                          {!isEmpty(graph) &&
                            isArray(graph) &&
                            graph?.map((value, index) => (
                              <View
                                style={[
                                  styles.marker,
                                  {
                                    backgroundColor: BaseColors.black80,
                                  },
                                ]}
                                key={index}
                              />
                            ))}
                        </View>

                        <View style={styles.rangeLabelsContainer}>
                          {day
                            ?.map((label, index) => parseInt(label))
                            .filter(value => !isNaN(value))
                            .sort((a, b) => a - b)
                            .map((sortedLabel, index) => (
                              <Text
                                key={index}
                                style={[
                                  styles.rangeLabel,
                                  {
                                    color: darkmode
                                      ? BaseColors.white
                                      : BaseColors.black90,
                                  },
                                ]}
                              >
                                {sortedLabel}
                              </Text>
                            ))}
                        </View>

                        <View style={styles.rangeLabelsContainer}>
                          {month?.map((label, index) => (
                            <Text
                              key={index}
                              style={[
                                styles.rangeLabel,
                                {
                                  color: darkmode
                                    ? BaseColors.white
                                    : BaseColors.black90,
                                },
                              ]}
                            >
                              {label}
                            </Text>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                  <View style={styles.modalUp}>
                    <Modal
                      isVisible={isModalVisible}
                      style={styles.modal}
                      animationIn="slideInUp"
                      animationOut="slideOutDown"
                      animationInTiming={500}
                      animationOutTiming={500}
                      backdropTransitionInTiming={500}
                      backdropTransitionOutTiming={500}
                    >
                      <View style={styles.modalContent}>
                        <Text style={{ fontSize: 80 }}>👩‍⚕️</Text>
                        <Text>
                          Hi 👋 Your today's Assessment is incomplete.{' '}
                        </Text>
                        <View style={styles.hi_msg}>
                          <TouchableOpacity
                            style={[
                              styles.button,
                              {
                                borderWidth: 1,
                                borderColor: BaseColors.secondary,
                              },
                            ]}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text style={{ color: BaseColors.secondary }}>
                              Skip now
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.button,
                              {
                                backgroundColor: BaseColors.secondary,
                              },
                            ]}
                            onPress={() => handleattempt()}
                          >
                            <Text style={{ color: BaseColors.white }}>
                              Attempt
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </>
              ) : (
                <Text style={styles.empty}>Data not available</Text>
              )}
            </ScrollView>
          ) : loader === false ? (
            <View style={{ flex: 1, marginTop: 10 }}>
              <EventDetailComponent
                eventDetail={eventDetail}
                datas={datas}
                navigation={navigation}
                darkmode={darkmode}
                eventDescriptions={eventDescriptions}
                getSymptomIconComponent={getSymptomIconComponent}
                calculateIconColor={calculateIconColor}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <ActivityIndicator
                size={'large'}
                color={BaseColors.primary}
                animating={true}
              />
            </View>
          )}
        </View>
      ) : (
        <ScrollView
          style={{
            paddingHorizontal: 15,
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.lightBg,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              colors={[BaseColors.primary]}
              tintColor={BaseColors.primary}
              refreshing={refreshLoader}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }
        >
          {assessmentLoad ? (
            <View
              style={{
                height: Dimensions.get('window').height / 1.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MainLoader />
            </View>
          ) : (
            <View style={{ paddingBottom: 20 }}>
              {!isEmpty(pendingData) ||
              !isEmpty(completedData) ||
              !isEmpty(missedData) ? (
                <>
                  {!isEmpty(pendingData) && (
                    <>
                      <Text
                        style={[
                          styles.assessmentTag,
                          {
                            color: darkmode
                              ? BaseColors.white
                              : BaseColors.black,
                          },
                        ]}
                      >
                        Assessment Due
                      </Text>
                      {pendingData?.map((item, index) => (
                        <CardList
                          key={index}
                          backgroundColoricon={BaseColors.primary}
                          tasks
                          data={item.details.assess_num}
                          status={item.details.status}
                          iconType={item.details.status}
                          rightArrow={true}
                          assessment={`Date: ${
                            item.details.date.split(',')[0]
                          }`}
                          onPress={() => {
                            navigation.navigate('Assessment', item);
                          }}
                        />
                      ))}
                    </>
                  )}
                  {!isEmpty(completedData) && (
                    <>
                      <Text
                        style={[
                          styles.assessmentTag,
                          {
                            color: darkmode
                              ? BaseColors.white
                              : BaseColors.black,
                          },
                        ]}
                      >
                        Completed Assessments
                      </Text>
                      {completedData?.map((item, index) => (
                        <CardList
                          key={index}
                          backgroundColoricon={BaseColors.primary}
                          tasks
                          data={item.details.assess_num}
                          status={item.details.status}
                          iconType={item.details.status}
                          rightArrow={false}
                          assessment={`Date: ${
                            item.details.date.split(',')[0]
                          }`}
                        />
                      ))}
                    </>
                  )}
                  {!isEmpty(missedData) && (
                    <>
                      <Text
                        style={[
                          styles.assessmentTag,
                          {
                            color: darkmode
                              ? BaseColors.white
                              : BaseColors.black,
                          },
                        ]}
                      >
                        Assessment Missed
                      </Text>
                      {missedData?.map((item, index) => (
                        <CardList
                          key={index}
                          backgroundColoricon={BaseColors.primary}
                          tasks
                          data={item.details.assess_num}
                          status={item.details.status}
                          iconType={item.details.status}
                          rightArrow={false}
                          assessment={`Date: ${
                            item.details.date.split(',')[0]
                          }`}
                        />
                      ))}
                    </>
                  )}
                </>
              ) : (
                <View
                  style={{
                    height: Dimensions.get('window').height / 1.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <NoData title={'No Data'} />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
