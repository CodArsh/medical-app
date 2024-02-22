import actions from './actions';
import types from './actions';

const initialState = {
  userData: {},
  accessToken: '',
  userType: '', // user type 'Customer' || 'ServiceProvider'
  introScreens: true,
  askLocationPermission: false,
  baseColor: {},
  darkmode: false,
  activeScreen: '',
  currentLocation: {},
  profileSetup: 0,
  profileData: {},
  newMissionData: {},
  askPermission: false,
  activeChatUser: null,
  isBiometric: false,
  fcmToken: '',
  refreshTokenExpire: '',
  eventListData: '',
  googleAttached: false,
  appleAttached: false,
  badge: false,
  DevMode: {
    Production: false,
    Development: true,
    UAT: false,
  },
  introMode: true,
  appTour: [],
  showAppTour: {
    home: true,
  },
};

export default function reducer(state = initialState, action) {
  // console.log('Reducer Change AUTH ===> ', action.type, action);
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
    case types.SET_USER_DATA:
      console.log(`${types.SET_USER_DATA} => `);
      return {
        ...state,
        userData: action.userData,
      };
    case types.SET_CURRENT_LOCATION:
      console.log(`${types.SET_CURRENT_LOCATION} => `, action.currentLocation);
      return {
        ...state,
        currentLocation: action.currentLocation,
      };
    case types.SET_ACCESSTOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case types.SET_DEVMODE:
      return {
        ...state,
        DevMode: action.DevMode,
      };

    case types.SET_INTROMODE:
      return {
        ...state,
        introMode: action.introMode,
      };
    case types.SET_APP_TOUR:
      return {
        ...state,
        appTour: action.appTour,
      };
    case types.SET_SHOW_APP_TOUR:
      return {
        ...state,
        showAppTour: action.showAppTour,
      };
    case types.SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.fcmToken,
      };
    case types.SET_USERTYPE:
      return {
        ...state,
        userType: action.userType,
      };
    case types.SET_INTRO:
      return {
        ...state,
        introScreens: action.introScreens,
      };
    case types.SET_BIO_METRIC:
      return {
        ...state,
        isBiometric: action.isBiometric,
      };
    case types.SET_PROFILESETUP:
      return {
        ...state,
        profileSetup: action.profileSetup,
      };
    case types.SET_PROFILEDATA:
      return {
        ...state,
        profileData: action.profileData,
      };
    case types.SET_NEWMISSIONDATA:
      return {
        ...state,
        newMissionData: action.newMissionData,
      };
    case types.LOGOUT:
      return {
        ...state,
        userData: {},
        accessToken: '',
        userType: '',
        coins: 0,
      };
    case types.SET_LOCATION_PERMISSION:
      return {
        ...state,
        askLocationPermission: action.askLocationPermission,
      };
    case types.SET_BASECOLOR:
      return {
        ...state,
        baseColor: action.baseColor,
      };
    case types.SET_DARKMODE:
      console.log('DARKMODE REDUX ==>> ', action.darkmode);
      return {
        ...state,
        darkmode: action.darkmode,
      };
    case types.SET_ACTIVE_SCREEN:
      return {
        ...state,
        activeScreen: action.activeScreen,
      };
    case types.SET_ASK_PERMISSION:
      return {
        ...state,
        askPermission: action.askPermission,
      };
    case types.SET_ACTIVE_CHAT_USER:
      return {
        ...state,
        activeChatUser: action.activeChatUser,
      };
    case types.SET_REFRESH_TOKEN_EXPIRED:
      return {
        ...state,
        refreshTokenExpire: action.refreshTokenExpire,
      };
    case types.SET_EVENT_LIST_DATA:
      return {
        ...state,
        eventListData: action.eventListData,
      };
    case types.SET_GOOGLE_ATTACHED:
      return {
        ...state,
        googleAttached: action.googleAttached,
      };
    case types.SET_APPLE_ATTACHED:
      return {
        ...state,
        appleAttached: action.appleAttached,
      };
    case types.SET_BADGE:
      return {
        ...state,
        badge: action.badge,
      };
    default:
      return state;
  }
}
