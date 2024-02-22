import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import Button from '@components/Button';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import { isEmpty } from 'lodash';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import MainLoader from '@components/MainLoader';

const Assessment = ({ navigation, route }) => {
  const { darkmode, userData } = useSelector(state => state.auth);
  const data = route?.params;
  let provider_name =
    userData?.provider_firstname + ' ' + userData?.provider_lastname;
  const [pendingData, setPendingData] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [pageLoad, setPageLoad] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);

  useEffect(() => {
    setPageLoad(false);
    if (!isEmpty(data)) {
      getAssessments(data?.details?.event_id);
    }
  }, [data]);

  const navigatetoscreen = () => {
    if (!isEmpty(pendingData)) {
      navigation.navigate(
        pendingData.details?.treatment_info === 0
          ? 'ChangeInfo'
          : pendingData.details?.symptom_inventory === 0
          ? 'Symptom'
          : pendingData.details?.immediate_recall === 0
          ? 'ImmediateRecall'
          : pendingData.details?.digit_recall === 0
          ? 'ImmediateRecallmain'
          : null,
        {
          event_id: pendingData?.details?.event_id,
          otherData: pendingData?.details,
          sourceScreen: 'Assessment',
          id: pendingData?.details?.id,
        },
      );
    } else {
      Toast.show({
        text1: 'Assessment already completed',
        type: 'info',
      });
    }
  };

  const getAssessments = async (eventId, bool) => {
    !bool && setPageLoad(true);
    const endPoint = `${BaseSetting.endpoints.eventDetails}?event_id=${eventId}`;
    try {
      const res = await getApiData(`${endPoint}`, 'GET');
      if (res?.status) {
        setEventDetails(res?.data?.event_details);
        const dueArray = [];
        res?.data?.assessments?.map((item, index) => {
          if (item.details?.status === 'Pending') {
            dueArray.push(item);
          }
        });
        if (!isEmpty(dueArray)) {
          setPendingData(dueArray[0]);
        }
      } else {
        Toast.show({
          text1: res?.message.toString(),
          type: 'error',
        });
      }
      setPageLoad(false);
      setRefreshLoader(false);
    } catch (error) {
      setPageLoad(false);
      setRefreshLoader(false);
      Toast.show({
        text1: error.toString(),
        type: 'error',
      });
      console.log('Error:', error);
    }
  };

  // this function is used to refresh scrollView data
  function onRefresh() {
    setRefreshLoader(true);
    getAssessments(data?.details?.event_id, true);
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
        HeaderText={
          pendingData?.treatment_info === 0
            ? 'Assessment 1'
            : pendingData?.symptom_inventory === 0
            ? 'Assessment 2'
            : pendingData?.immediate_recall === 0
            ? 'Assessment 3'
            : pendingData?.immediate_recall === 0
            ? 'Assessment 4'
            : 'Assessment'
        }
        HeaderCenter
        leftText="Back"
        leftBtnPress={() => {
          navigation.goBack();
        }}
      />

      <View style={{ flex: 1, marginHorizontal: 20, paddingBottom: 10 }}>
        {pageLoad ? (
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MainLoader />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: 10,
              paddingBottom: 50,
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
            <Text
              style={[
                styles.titleText,
                {
                  color: darkmode ? BaseColors.white : BaseColors.textColor,
                },
              ]}
            >
              Assessment Details
            </Text>
            <View>
              <Text
                style={[
                  styles.titlesubText,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                Event
              </Text>
              <Text
                style={[
                  styles.titledetail,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                {eventDetails?.title ? eventDetails?.title : '-'}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.titlesubText,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                Provider
              </Text>
              <Text
                style={[
                  styles.titledetail,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                {userData?.provider_credentials
                  ? provider_name + ' ' + userData?.provider_credentials
                  : userData?.provider_title
                  ? userData?.provider_title + ' ' + provider_name
                  : provider_name}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.titlesubText,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                Assessment Type
              </Text>
              <Text
                style={[
                  styles.titledetail,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                {pendingData?.details?.assessment_type}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.titlesubText,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                Instructions
              </Text>
              <Text
                style={[
                  styles.titledetail,
                  {
                    color: darkmode ? BaseColors.white : BaseColors.textColor,
                  },
                ]}
              >
                Pellentesque metus neque, egestas id tincidunt et, porttitor
                quis libero. Suspendisse placerat sollicitudin finibus. Ut lorem
                quam, aliquam cursus diam fermentum, volutpat mollis enim. Sed
                eu dui eget lectus euismod pretium nec quis ipsum. Nam pretium
                nisl sed laoreet pulvinar. Etiam dolor nisi, pulvinar vitae
                justo in, consequat v
              </Text>
            </View>
          </ScrollView>
        )}
        <View style={styles.btnContainer}>
          <Button
            shape="round"
            title={'Begin Assessment'}
            style={styles.Assessment}
            onPress={navigatetoscreen}
            disabled={pageLoad}
          />
        </View>
      </View>
    </View>
  );
};

export default Assessment;
