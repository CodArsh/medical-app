import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import moment from 'moment';

/**
 *
 *@function showNotification
 *
 */
export const showNotification = (remoteMessage, isForeground = false) => {
  console.log('Show Notification Called', remoteMessage);
  const { data, notification, sentTime } = remoteMessage;
  if (
    !remoteMessage.hasOwnProperty('notification') /*notification === undefined*/
  ) {
    // For Handling Comet Chat Notifications
    console.log('No Notification key present');
    const { title, alert, message } = data;
    let notificationTitle = title;
    if (message) {
      sendLocalNotification(notificationTitle, alert, message);
    }
  } else {
    console.log('Notification key present');
    //Receiving Notification from our server in foreground
    const { body, title } = notification;
    sendLocalNotification(title, body, data, sentTime);
  }
};

const sendLocalNotification = (title, body, data, time) => {
  const parseData = JSON.parse(data?.data);
  if (Platform.OS === 'android') {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      largeIconUrl: parseData?.icon_url,
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_launcher_round', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      title: title,
      message: body,
      // bigPictureUrl: data?.imageUrl || '',
      when: time || moment().unix(),
      userInfo: data,
      // tag: tag,
    });
  } else {
    let details = {
      alertTitle: title,
      alertBody: body,
      userInfo: data,
    };

    console.log('PushNotificationIOS ===', PushNotificationIOS);
    PushNotificationIOS.presentLocalNotification(details);
  }
};
