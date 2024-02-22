import { Dimensions } from 'react-native';
const devMode = __DEV__;
const baseUrl = devMode
  ? 'http://192.168.1.86:3000/v1'
  : 'https://api.oculabs.com/v1';
const devUrl = 'https://api.dev.oculabs.com/v1';
const prodUrl = 'https://api.oculabs.com/v1';
const uatUrl = 'https://api.uat.oculabs.com/v1';

const BaseSetting = {
  name: 'oculo',
  displayName: 'oculo',
  appVersionCode: '1',
  baseUrl,
  devUrl,
  uatUrl,
  prodUrl,
  api: baseUrl,
  nWidth: Dimensions.get('window').width,
  nHeight: Dimensions.get('window').height,
  timeOut: 30000,
  MAPS_API_CALL_KEY: '',
  GOOGLE_CLIENT_ID:
    '892302063818-h59tbg70l3lbsgqlj43ojfr35d89sa88.apps.googleusercontent.com',
  emailRegex:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  buttonOpacity: 0.8,
  endpoints: {
    login: '/patient/login', //done
    generateOtp: '/user/generate-otp', //done
    verifyOtp: '/user/verify-otp', //done
    resetPassword: '/user/reset-password', //done
    changePassword: '/patient/change-password', //done
    createPassword: '/patient/create-password', //done
    question: '/patient/list-history', //done
    savePatient: '/patient/save-history', //done
    updatePatient: '/patient/update-profile', //done
    questionList: '/questions/list', //done
    createCall: '/assessment/create-immediate-recall', //done
    sendnumberarray: '/assessment/create-digit-recall', //done
    symptom: '/assessment/create-symptom-inventory', //done
    eventList: '/event/list', //done
    comment: '/assessment/add-comment', //done
    createTreatmentInfo: '/assessment/create-treatment-info', //done
    authentication: '/patient/change-2fa', //done
    createRequest: '/event/create-request',
    enable2FA: '/patient/enable-2fa', //done
    getPatient: '/patient/get-patient', //done
    spiderReport: '/reports/spider-reports', //done
    eventDetails: '/event/details', //done
    zigzagReports: '/reports/zig-zag-reports', //done
    notificationList: '/notification/get-all', //done
    googleConnect: '/patient/social-connect', //done
    googleDisconnect: '/patient/disconnect-social', //done
    googleLogin: '/patient/social-login', //done
    singleRemove: '/notification/remove', //done
    clearAll: '/notification/remove-all', //done
    logout: '/user/logout', //done
    readNotification: '/notification/read-single',
    allReadNotification: '/notification/read-all',
    // app status
    appStatus: '/developer/check-app-status',
    getStatus: '/developer/get-app-status',

    // setting
    notificationSetting: '/notification/set-reminder',
    sportActiveList: '/sport/list',
  },

  geolocationOptions: {
    enableHighAccuracy: false,
    timeout: 50000,
    maximumAge: 10000,
    distanceFilter: 1,
  },
  geoOptionHighAccurate: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 10000,
    distanceFilter: 1,
  },
};

export default BaseSetting;
