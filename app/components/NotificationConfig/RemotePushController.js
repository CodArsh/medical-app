import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { showNotification } from '@components/NotificationConfig/NotificationHelper';
import { navigationRef } from '../../navigation/NavigationService';
import { store } from '@redux/store/configureStore';
import NotificationAction from '@redux/reducers/notification/actions';
import _ from 'lodash';

const storeFCMToken = async token => {
  const {
    notification: { fcmToken },
  } = store.getState();

  try {
    console.log('Saved fcm token', fcmToken);
    if (fcmToken.localeCompare(token) != 0) {
      console.log('FCM Token Has changed');
      await store.dispatch(NotificationAction.setFcmToken(token));
    }
  } catch (error) {}
};

const handleNotification = remoteMessage => {
  const actionType = remoteMessage?.data?.action;
  // const actionData =
  //   !_.isEmpty(remoteMessage?.data?.data) &&
  //   _.isString(remoteMessage?.data?.data)
  //     ? JSON.parse(remoteMessage?.data?.data)
  //     : {};

  // const data =
  //   !_.isEmpty(actionData) && _.isObject(actionData) ? actionData : {};
  // if (actionType === 'clinic_list') {
  //   // navigationRef.current?.navigate('Clinic');
  // } else if (actionType === 'staff_list') {
  //   // navigationRef.current?.navigate('Team');
  // }
};
/**
 *firebase notification
 * @function  RemotePushController
 */
const RemotePushController = () => {
  useEffect(() => {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('LOCAL NOTIFICATION ==>', JSON.stringify(notification));
        const {
          auth: { activeScreen },
        } = store.getState();
        // old app code
        // dispatch({ type: 'onNotificationOpen', payload: notification });
        store.dispatch(NotificationAction.onNotificationOpen(notification));
        console.log('notification ===39==>>> ', notification);
        // notification on click
        if (notification.userInteraction && notification.foreground) {
          handleNotification(notification);
          // navigationRef?.current?.navigate('FurtherOngoing', {
          //   proposalId: proposeNoti?.id,
          //   isDeepLinkProject: false,
          // });
        }
      },
      popInitialNotification: true,
      requestPermissions: false,
    });
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: 'Default channel', // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('remoteMessage ====69=>>> ', remoteMessage);
      handleNotification(remoteMessage);
      // const proposeNoti = JSON.parse(remoteMessage?.data?.meta);
      // navigationRef?.current?.navigate('FurtherOngoing', {
      //   proposalId: proposeNoti?.id,
      //   isDeepLinkProject: false,
      // });
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('remoteMessage ===83==>>> ', remoteMessage);
          handleNotification(remoteMessage);
          // const proposeNoti = JSON.parse(remoteMessage?.data?.meta);
          // navigationRef?.current?.navigate('FurtherOngoing', {
          //   proposalId: proposeNoti?.id,
          //   isDeepLinkProject: false,
          // });
        }
      });
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        console.log('FCM Token', token);
        return storeFCMToken(token);
      });
    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      storeFCMToken(token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const actionType = remoteMessage?.data?.action;
      // const screenName =
      //   navigationRef?.current &&
      //   _.isFunction(navigationRef?.current?.getCurrentRoute) &&
      //   !_.isUndefined(navigationRef?.current?.getCurrentRoute()?.name)
      //     ? navigationRef?.current?.getCurrentRoute()?.name
      //     : '';
      // console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // if (screenName === 'Notification') {
      //   store.dispatch(NotificationAction.setActionType('update_notification'));
      // } else {
      //   store.dispatch(NotificationAction.setActionType(actionType));
      showNotification(remoteMessage, true);
      // }
    });
    return unsubscribe;
  }, []);
  return null;
};

export default RemotePushController;
