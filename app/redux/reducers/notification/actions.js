const actions = {
  SET_FCM_TOKEN: 'notification/SET_FCM_TOKEN',
  SET_UPDATE_NOTIFICATION: 'notification/SET_UPDATE_NOTIFICATION',
  SET_ON_NOTIFICATION_OPEN: 'notification/SET_ON_NOTIFICATION_OPEN',
  SET_UPDATE_NOTIFICATION_COUNT: 'notification/SET_UPDATE_NOTIFICATION_COUNT',
  CLEAR_DATA: 'home/CLEAR_DATA',
  SET_NOTIFICATION_LIST: 'notification/SET_NOTIFICATION_LIST',
  SET_FCM_TOKEN_CALL: 'notification/SET_FCM_TOKEN_CALL',

  setFcmToken: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_FCM_TOKEN,
        fcmToken: data,
      });
  },
  updateNotification: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_UPDATE_NOTIFICATION,
        notification: data,
      });
  },
  onNotificationOpen: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_ON_NOTIFICATION_OPEN,
        openedNotification: data,
      });
  },
  updateCountOfNotifications: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_UPDATE_NOTIFICATION_COUNT,
        countOfNotification: data,
      });
  },
  clearData: () => dispatch =>
    dispatch({
      type: actions.CLEAR_DATA,
    }),
  setNotificationList: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_NOTIFICATION_LIST,
        notificationList: data,
      });
  },
  setFcmTokenCall: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_FCM_TOKEN_CALL,
        fcmTokenCall: data,
      });
  },
};

export default actions;
