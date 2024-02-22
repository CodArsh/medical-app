import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import HeaderBar from '@components/HeaderBar';
import CardList from '@components/CardList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { ScrollView } from 'react-native';
import AuthAction from '@redux/reducers/auth/actions';
import Toast from 'react-native-toast-message';
import { flattenDeep, isArray, isNull } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useIsFocused } from '@react-navigation/native';
import MainLoader from '@components/MainLoader';

export default function Notification({ navigation }) {
  const { darkmode, badge } = useSelector(state => state.auth);
  const { setBadge } = AuthAction;
  const [notificationList, setNotificationList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    loadMore: false,
  });
  const [pageLoader, setPageLoader] = useState(true);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paginationLoader, setPaginationLoader] = useState(false);
  const [userHasSwiped, setUserHasSwiped] = useState(false); // New state
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setPageLoader(true);
    fetchData(false);
  }, []);

  useEffect(() => {
    if (refreshLoader) {
      fetchData(false);
    }
  }, [refreshLoader]);

  const fetchData = async (bool, page = 1) => {
    try {
      const endPoint = `${BaseSetting.endpoints.notificationList}?page=${page}`;
      const resp = await getApiData(endPoint, 'GET');
      if (resp?.status) {
        setPagination({
          ...pagination,
          loadMore: resp?.data?.pagination?.isMore,
          page: page,
        });
        let nArr = [];
        if (bool) {
          nArr = flattenDeep([notificationList, resp?.data?.item || []]);
        } else {
          nArr = resp?.data?.item;
        }
        setNotificationList(nArr);
      } else {
        setPagination({
          ...pagination,
          loadMore: false,
        });
      }
      dispatch(setBadge(false));
      setPageLoader(false);
      setRefreshLoader(false);
      setPaginationLoader(false);
    } catch (error) {
      console.error(error);
      setPageLoader(false);
      setPaginationLoader(false);
    }
  };

  useEffect(() => {
    if (badge) {
      fetchData();
    }
  }, [badge]);

  const singleRemove = async deleteId => {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.singleRemove,
        'POST',
        { id: deleteId },
        '',
        false,
      );
      console.log(response);
      if (response?.status) {
        const newData = [...notificationList];
        const prevIndex = newData.findIndex(item => item.id === deleteId);

        if (prevIndex > -1) {
          newData.splice(prevIndex, 1);
          setNotificationList(newData);
        }
        Toast.show({
          type: 'success',
          text1: response.message,
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
  // clear all notifications
  const handleClearAll = async () => {
    const endPoint = BaseSetting.endpoints.clearAll;
    try {
      const response = await getApiData(`${endPoint}`, 'GET');
      setLoad(true);
      if (response?.status) {
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
      setLoad(false);
      setVisible(false);
      fetchData();
    } catch (error) {
      console.log('error =======>>>', error);
    }
  };
  const handleSwipe = () => {
    setUserHasSwiped(true);
  };

  const renderHiddenItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.swipeDelete}>
        {userHasSwiped && (
          <TouchableOpacity
            style={styles.rightAction}
            onPress={() => {
              singleRemove(item.id);
            }}
          >
            <Icon name="delete" size={30} color={BaseColors.red} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  async function notificationRead(id) {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.readNotification,
        'PATCH',
        { id },
        '',
        false,
      );
      if (response?.status) {
        const newData = [...notificationList];
        const prevIndex = newData.findIndex(item => item.id === id);
        if (prevIndex > -1) {
          newData[prevIndex].is_read = 1;
          setNotificationList(newData);
        }
      } else {
        Toast.show({
          text1: response?.message,
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Error ===========>', err);
    }
  }

  const renderItem = ({ item, index }) => {
    const parseData = JSON.parse(item?.data);
    return (
      <TouchableOpacity
        key={index}
        style={{ paddingHorizontal: 15 }}
        activeOpacity={0.7}
      >
        <CardList
          iconName="clock-o"
          backgroundColoricon={BaseColors.darkorange}
          showClock={true}
          data={item?.title}
          status={item?.message}
          isRead={item.is_read}
          onPress={() => {
            notificationRead(item?.id);
            if (
              parseData?.type &&
              (parseData?.type === 'event_created' ||
                parseData?.type === 'assessment_created')
            ) {
              navigation.navigate('Assessment', {
                from: 'notification',
                details: { event_id: parseData?.event_id },
              });
            } else {
              navigation.navigate('InsideNotification', { id: item });
            }
          }}
        />
      </TouchableOpacity>
    );
  };

  function onRefresh() {
    setPagination({
      page: 1,
      loadMore: true,
    });
    setRefreshLoader(true);
    setUserHasSwiped(false); // Reset userHasSwiped state
  }

  function loadMoreData() {
    if (pagination?.loadMore && !paginationLoader && !pageLoader) {
      setPaginationLoader(true);
      const page = pagination?.page + 1;
      fetchData(true, page);
    }
  }

  function renderNoData() {
    return (
      <ScrollView
        contentContainerStyle={styles.noDataView}
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
          style={{ color: darkmode ? BaseColors.white : BaseColors.textColor }}
        >
          No Data
        </Text>
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode
            ? BaseColors.lightBlack
            : BaseColors.lightBg,
        },
      ]}
    >
      <HeaderBar
        HeaderText={'Notification'}
        HeaderCenter
        rightText="Clear"
        rightBtnPress={() => setVisible(true)}
      />
      <View style={{ marginTop: 8 }} />

      {!pageLoader &&
      isArray(notificationList) &&
      notificationList.length === 0 ? (
        renderNoData()
      ) : (
        <View style={{ flex: 1 }}>
          {pageLoader ? (
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
            <Animatable.View animation={'slideInUp'} style={{ flex: 1 }}>
              <SwipeListView
                data={notificationList}
                renderItem={renderItem}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.1}
                renderHiddenItem={renderHiddenItem}
                showsVerticalScrollIndicator={false}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                disableRightSwipe
                keyExtractor={item => item?.id}
                previewOpenDelay={3000}
                onSwipeValueChange={handleSwipe}
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
                ListFooterComponent={() =>
                  paginationLoader ? (
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <ActivityIndicator
                        color={BaseColors.primary}
                        size="small"
                      />
                    </View>
                  ) : null
                }
              />
            </Animatable.View>
          )}
        </View>
      )}

      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.confirmmmodalcenteredView}>
          <View
            style={[
              styles.confirmmmodalView,
              {
                backgroundColor: darkmode
                  ? BaseColors.textColor
                  : BaseColors.white,
              },
            ]}
          >
            <Text
              style={[
                styles.confirmmodaltitleText,
                {
                  color: darkmode ? BaseColors.white : BaseColors.black90,
                },
              ]}
            >
              Are you sure?
            </Text>
            <Text
              style={[
                styles.confirmmodalText,
                {
                  color: darkmode ? BaseColors.white : BaseColors.black,
                },
              ]}
            >
              You want to clear all notifications?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => handleClearAll()}
                disabled={false}
              >
                {load ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={BaseSetting.buttonOpacity}
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
