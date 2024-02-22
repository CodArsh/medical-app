import {getDecodedToken} from '@utils/CommonFunction';
import types from './actions';

const initialState = {
  userData: {},
  notification: null,
  openedNotification: null,
  countOfNotification: 0,
  fcmToken: '',
  notificationList: [],
  fcmTokenCall: true,
};

export default function reducer(state = initialState, action) {
  // console.log('Reducer Change ===> ', action.type, action);
  switch (action.type) {
    case 'persist/REHYDRATE':
      if (
        action.payload &&
        action.payload.auth &&
        action.payload.auth.introShown
      ) {
        return {
          ...state,
          ...action.payload.auth,
          introShown: false,
        };
      }
      return state;
    case types.SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.fcmToken,
      };
    case types.SET_UPDATE_NOTIFICATION:
      return {
        ...state,
        notification: action.notification,
      };
    case types.SET_ON_NOTIFICATION_OPEN: {
      return {
        ...state,
        openedNotification: action.payload,
      };
    }
    case types.SET_UPDATE_NOTIFICATION_COUNT: {
      return {
        ...state,
        countOfNotification: action.payload,
      };
    }
    case types.CLEAR_DATA:
      return {
        ...state,
        userData: {},
        notification: null,
        openedNotification: null,
        countOfNotification: 0,
      };
    case types.SET_NOTIFICATION_LIST:
      return {
        ...state,
        notificationList: action.notificationList,
      };
    case types.SET_FCM_TOKEN_CALL:
      return {
        ...state,
        fcmTokenCall: action.fcmTokenCall,
      };
    default:
      return state;
  }
}
