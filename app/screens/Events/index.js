import {
  View,
  Text,
  Dimensions,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import CardList from '@components/CardList';
import { Images } from '@config';
import HeaderBar from '@components/HeaderBar';
import { useDispatch, useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import BaseSetting from '@config/setting';
import { isEmpty, isArray, isNumber, isNull } from 'lodash';
import { getApiData } from '@utils/apiHelper';
import NoData from '@components/NoData';
import NetInfo from '@react-native-community/netinfo';
import Authentication from '@redux/reducers/auth/actions';
import { Alert } from 'react-native';
import MainLoader from '@components/MainLoader';
import { useIsFocused } from '@react-navigation/native';
import EyeTrackingRedux from '@redux/reducers/eyeTracking/actions';
import { check, PERMISSIONS } from 'react-native-permissions';

export default function Events({ navigation }) {
  const { setEventListData } = Authentication;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { darkmode, eventListData } = useSelector(state => state.auth);
  const [eventDetails, setEventDetails] = useState([]);
  const [closedEvents, setClosedEvents] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const { setCheckCameraPermission } = EyeTrackingRedux;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      EventListData();
    });

    return unsubscribe;
  }, [isFocused]);

  useEffect(() => {
    EventListData();
    checkInternetConnection();
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    let permission;
    // Check the correct permission based on the platform
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    // Check the permission status
    const result = await check(permission);
    dispatch(setCheckCameraPermission(result));
    // return result;
  };

  // this function is used to get event list
  const EventListData = async bool => {
    !bool && setLoader(true);
    const endPoint = `${BaseSetting.endpoints.eventList}?created_from=app`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        const closedArray = [];
        const openArray = [];
        res?.data?.events?.map((item, index) => {
          if (item.status != 1) {
            closedArray.push(item);
          } else {
            openArray.push(item);
          }
        });
        setClosedEvents(closedArray);
        dispatch(setEventListData(res?.data?.events));
        setEventDetails(openArray);
        setLoader(false);
      }
      setLoader(false);
      setRefreshLoader(false);
    } catch (error) {
      setRefreshLoader(false);
      console.log('📌 ⏩ file: index.js:24 ⏩ LangListAPI ⏩ error:', error);
    }
  };

  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('No Internet', 'Please check your network settings');
      setEventDetails(eventListData);
    }
  };

  // this function is used to refreshing a event list data
  function onRefresh() {
    EventListData(true);
    setRefreshLoader(true);
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <HeaderBar HeaderText={'Events'} HeaderCenter />
      {/* <View style={{ marginTop: !darkmode ? 0 : 2 }} /> */}
      <ScrollView
        style={[
          styles.main,
          {
            backgroundColor: darkmode
              ? BaseColors.lightBlack
              : BaseColors.lightBg,
          },
        ]}
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
        <View style={{ paddingHorizontal: 15 }}>
          {loader ? (
            <View
              style={{
                height: Dimensions.get('window').height / 1.4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MainLoader />
            </View>
          ) : (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    marginVertical: 5,
                    color: darkmode ? BaseColors.white : BaseColors.black90,
                  }}
                >
                  Eye Tracking
                </Text>
                <CardList
                  rightArrow
                  onPress={() => navigation.navigate('CalibrationInstruction')}
                  iconName="head-cog"
                  backgroundColoricon={BaseColors.primary}
                  showmanIcon={true}
                  data={'Mar 30 2000'}
                  status={'Completed'}
                  assessment={'Assessment 4/5'}
                />
              </View>
              <View>
                {!isEmpty(eventDetails) && isArray(eventDetails) ? (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        marginVertical: 5,
                        color: darkmode ? BaseColors.white : BaseColors.black90,
                      }}
                    >
                      Open Events
                    </Text>
                    {eventDetails?.map((item, index) => {
                      let filled_count =
                        Number(
                          item.symptom_info &&
                            !isNull(item.symptom_info) &&
                            item.symptom_info == 1
                            ? 1
                            : 0,
                        ) +
                        Number(
                          item.immediate_recall &&
                            !isNull(item.immediate_recall) &&
                            item.immediate_recall == 1
                            ? 1
                            : 0,
                        ) +
                        Number(
                          item.digit_recall &&
                            !isNull(item.digit_recall) &&
                            item.digit_recall == 1
                            ? 1
                            : 0,
                        ) +
                        Number(
                          item.treatment_info &&
                            !isNull(item.treatment_info) &&
                            item.treatment_info == 1
                            ? 1
                            : 0,
                        );

                      let total_count =
                        Number(isNumber(item.symptom_info) ?? 1) +
                        Number(isNumber(item.immediate_recall) ?? 1) +
                        Number(isNumber(item.digit_recall) ?? 1) +
                        Number(isNumber(item.treatment_info) ?? 1);

                      const newItem = { ...item, graph: !isEnabled };
                      return (
                        <CardList
                          key={index}
                          iconName="head-cog"
                          backgroundColoricon={BaseColors.primary}
                          showmanIcon={true}
                          rightArrow={
                            (item.symptom_info ?? 1) +
                              (item.immediate_recall ?? 1) +
                              (item.digit_recall ?? 1) +
                              (item.treatment_info ?? 1) ===
                            4
                              ? true
                              : true
                          }
                          onPress={() =>
                            navigation.navigate('EventDetails', newItem)
                          }
                          image={Images.manimage}
                          data={item?.title}
                          status={`${
                            filled_count === total_count
                              ? 'Completed'
                              : 'Pending'
                          }`}
                          assessment={`Assessment ${filled_count} / ${total_count}`}
                        />
                      );
                    })}
                  </>
                ) : null}
              </View>

              <View>
                {!isEmpty(closedEvents) && isArray(closedEvents) ? (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        marginVertical: 5,
                        color: darkmode ? BaseColors.white : BaseColors.black90,
                      }}
                    >
                      Closed Events
                    </Text>
                    {closedEvents?.map((item, index) => {
                      return (
                        <CardList
                          key={index}
                          iconName="head-cog"
                          backgroundColoricon={BaseColors.primary}
                          showmanIcon={true}
                          image={Images.manimage}
                          data={item?.title}
                          status={'Event Closed'}
                        />
                      );
                    })}
                  </>
                ) : null}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
