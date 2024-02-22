import types from './actions';

const initialState = {
  calibration: {},
  calibration_gaze: {},
  calibrationTime: 2000,
  checkAttempt: 0,
  cameraPermission: '',
};

export default function reducer(state = initialState, action) {
  // console.log('Reducer Change AUTH ===> ', action.type, action);
  switch (action.type) {
    case types.SET_CALIBRATION:
      console.log(`${types.SET_CALIBRATION} => `);
      return {
        ...state,
        calibration: action.calibration,
      };

    case types.RESET_CALIBRATION:
      console.log(`${types.RESET_CALIBRATION} => `);
      return {
        ...state,
        calibration: {},
      };

    case types.SET_CALIBRATION_GAZE:
      console.log(`${types.SET_CALIBRATION_GAZE} => `);
      return {
        ...state,
        calibration_gaze: action.calibration,
      };

    case types.RESET_CALIBRATION_GAZE:
      console.log(`${types.RESET_CALIBRATION_GAZE} => `);
      return {
        ...state,
        calibration_gaze: {},
      };

    case types.SET_CAL_TIME:
      console.log(`${types.SET_CAL_TIME} => `);
      return {
        ...state,
        calibrationTime: action.time,
      };

    case types.CHECK_ATTEMPT:
      console.log(`${types.CHECK_ATTEMPT} => `);
      return {
        ...state,
        checkAttempt: action.checkAttempt,
      };

    case types.CHECK_CAMERA_PERMISSION:
      console.log(`${types.CHECK_CAMERA_PERMISSION} => `);
      return {
        ...state,
        cameraPermission: action.cameraPermission,
      };

    default:
      return state;
  }
}
