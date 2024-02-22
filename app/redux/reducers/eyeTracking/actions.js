const actions = {
  SET_CALIBRATION: 'auth/SET_CALIBRATION',
  RESET_CALIBRATION: 'auth/RESET_CALIBRATION',
  SET_CALIBRATION_GAZE: 'auth/SET_CALIBRATION_GAZE',
  RESET_CALIBRATION_GAZE: 'auth/RESET_CALIBRATION_GAZE',
  SET_CAL_TIME: 'auth/SET_CAL_TIME',
  CHECK_ATTEMPT: 'auth/CHECK_ATTEMPT',
  CHECK_CAMERA_PERMISSION: 'auth/CHECK_CAMERA_PERMISSION',

  setCalibration: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_CALIBRATION,
        calibration: data,
      });
  },
  resetCalibration: () => {
    return dispatch =>
      dispatch({
        type: actions.RESET_CALIBRATION,
      });
  },
  setCalibrationGaze: data => {
    return dispatch =>
      dispatch({
        type: actions.SET_CALIBRATION_GAZE,
        calibration: data,
      });
  },
  resetCalibrationGaze: () => {
    return dispatch =>
      dispatch({
        type: actions.RESET_CALIBRATION_GAZE,
      });
  },
  setCalTime: time => {
    return dispatch =>
      dispatch({
        type: actions.SET_CAL_TIME,
        time,
      });
  },
  setCheckAttempt: data => {
    return dispatch =>
      dispatch({
        type: actions.CHECK_ATTEMPT,
        checkAttempt: data,
      });
  },
  setCheckCameraPermission: data => {
    return dispatch =>
      dispatch({
        type: actions.CHECK_CAMERA_PERMISSION,
        cameraPermission: data,
      });
  },
};

export default actions;
