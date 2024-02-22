import { BaseColors } from '@config/theme';
import { NativeModules } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import ScreenBrightness from 'react-native-screen-brightness';
const { EyeTracking } = NativeModules;

export const ET_DEFAULTS = {
  dot_width: 48,
  dot_height: 48,
  dot_radius: 24,
  dot_background_color: BaseColors?.PrimaryBlue,
  pL: 20,
  pR: 20,
  pT: 20,
  pB: 20,
  minRequiredCoordinates: 100,
  messages: {
    ambientLightInfo:
      'Checking the Ambient Lights, Please make sure to switch on the light to accurately track your eye movementns.',
  },
  cali: {
    eyesDistance: 160,
    DEF_MSG: 'Position Face for \n Calibration',
    userEyeSize: 16,
    userEyeBorder: 4,
    userEyeBorderInvalidColor: BaseColors?.red,
    userEyeBorderValidColor: BaseColors?.primary,
    systemEyeCircleSize: 42,
    caliBigDotSize: 48,
    validationMsg: {
      head_up: 'Move your head up',
      head_down: 'Move your head down',
      move_closer: 'Move a bit closer to the device.',
      move_away: 'Move a bit away from the device.',
      align_left: 'Align your left eye with the circle.',
      align_right: 'Align your right eye with the circle.',
      success: 'Perfect! Stay still.',
      light_invalid:
        'Please ensure that the surrounding lighting conditions are adequate for accurate Eye Tracking.',
    },
  },
};

// Init: Initiates the Eye Tracking
// Call this when you want to start trackinig the EyeGaze
export const init = () => {
  return new Promise(resolve => {
    // On Eye Tracking start let's set Keep Awake and Brightness to full
    KeepAwake.activate();
    ScreenBrightness.setBrightness(1);
    // TODO: Adding Error Handling in Swift and JS
    EyeTracking.initTracking(result => {
      resolve(true);
    });
  });
};

export const stopTracking = () => {
  EyeTracking.stopTracking(result => {
    console.log('Result => ', result);
  });
};

export const startEyePosTracking = () => {
  return new Promise(resolve => {
    EyeTracking.startEyePosition(result => {
      resolve(true);
    });
  });
};

export const stopEyePosTracking = () => {
  return new Promise(resolve => {
    EyeTracking.stopEyePosition(result => {
      resolve(true);
    });
  });
};

// Helper function to calculate screen X value
export const calculateScreenX = (eyeX, calibratedPositions, ViewWidth) => {
  const { TL, TR } = calibratedPositions;

  if (!TL || !TR) {
    return 0;
  }
  const minX = TL.avgX;
  const maxX = TR.avgX;
  const width = maxX - minX;
  const normalizedX = (eyeX - minX) / width;
  const screenX = normalizedX * ViewWidth;
  return screenX;
};

// Helper function to calculate screen Y value
export const calculateScreenY = (eyeY, calibratedPositions, ViewHeight) => {
  const { TL, BL } = calibratedPositions;

  if (!TL || !BL) {
    return 0;
  }
  const minY = TL.avgY;
  const maxY = BL.avgY;
  const height = maxY - minY;
  const normalizedY = (eyeY - minY) / height;
  const screenY = normalizedY * ViewHeight;
  return screenY;
};

export const calculateAveragePosition = (xArray, yArray) => {
  // Check if the arrays have the same length
  if (xArray.length !== yArray.length) {
    throw new Error('X and Y arrays must have the same length');
  }

  // Calculate the mean (average) of X and Y positions
  const meanX = xArray.reduce((acc, curr) => acc + curr, 0) / xArray.length;
  const meanY = yArray.reduce((acc, curr) => acc + curr, 0) / yArray.length;

  // Calculate the standard deviation of X and Y positions
  const stdDevX = Math.sqrt(
    xArray.reduce((acc, curr) => acc + (curr - meanX) ** 2, 0) / xArray.length,
  );
  const stdDevY = Math.sqrt(
    yArray.reduce((acc, curr) => acc + (curr - meanY) ** 2, 0) / yArray.length,
  );

  // Set the threshold for outlier removal (e.g., 2 times the standard deviation)
  const outlierThreshold = 2;

  // Remove outliers from X and Y arrays based on the threshold
  const filteredX = xArray.filter(
    x => Math.abs(x - meanX) <= outlierThreshold * stdDevX,
  );
  const filteredY = yArray.filter(
    y => Math.abs(y - meanY) <= outlierThreshold * stdDevY,
  );

  // Calculate the average X and Y positions from the filtered arrays
  const avgX =
    filteredX.reduce((acc, curr) => acc + curr, 0) / filteredX.length;
  const avgY =
    filteredY.reduce((acc, curr) => acc + curr, 0) / filteredY.length;

  // Return the average X and Y positions as an object
  return { x: avgX, y: avgY };
};

// Validating the Ambient Lighting
export const validateLighting = ambientIntensity => {
  if (ambientIntensity < 100) {
    return {
      status: 'Poor',
      message:
        'Lighting is too dim for optimal eye tracking. Please increase the light in the room.',
    };
  } else if (ambientIntensity >= 100 && ambientIntensity <= 500) {
    return {
      status: 'Moderate',
      message:
        'Lighting is moderate. It might work for eye tracking, but for optimal performance, consider increasing the light a bit.',
    };
  } else if (ambientIntensity > 500 && ambientIntensity <= 2000) {
    return {
      status: 'Good',
      message: 'Lighting is good for eye tracking.',
    };
  } else if (ambientIntensity > 2000) {
    return {
      status: 'Very Bright',
      message:
        "Lighting is very bright. Consider ensuring it's not causing discomfort to the user or affecting the camera view with reflections or glare.",
    };
  }
};

export const formatObjectValues = obj => {
  if (!obj) {
    return '-';
  }
  const order = ['w', 'x', 'y', 'z'];

  return order
    .map(key => {
      const value = obj[key];
      if (typeof value === 'number') {
        return `${key.toUpperCase()}: ${value.toFixed(4)}`;
      }
      return `${key.toUpperCase()}: ${value}`;
    })
    .join('\n');
};

// Event Object Data Sort
const sortOrder = [
  'rightEyeLookAtPosition',
  'leftEyeLookAtPosition',
  'rightEyeDistance',
  'leftEyeDistance',
  'rightEyeXY',
  'leftEyeXY',
  'rightEyePosition',
  'leftEyePosition',
  'facePosition',
  'faceRotation',
  'devicePosition',
  'deviceRotation',
  'centerEyeLookAtPoint',
  'rightEyeLookAtPoint',
  'leftEyeLookAtPoint',
  'rightEyeBlink',
  'leftEyeBlink',
  'totalBlinks',
  'isBlink',
  'light',
  'timestamp',
];

export const sortObjectByKeysOrder = (obj, order) => {
  const newObj = {};
  order.forEach(orderKey => {
    if (obj[orderKey]) {
      newObj[orderKey] = obj[orderKey];
    }
  });

  return newObj;
};

export const remapEventObject = event => {
  // Remap Object as asked by Kyle 18 Oct
  let eventObject = Object.assign({}, event);

  // console.log('remapEventObject', event, eventObject);

  eventObject.rightEyeXY = {
    rightEyeX: event.eyeXY.rightEyeX,
    rightEyeY: event.eyeXY.rightEyeY,
  };
  eventObject.leftEyeXY = {
    leftEyeX: event.eyeXY.leftEyeX,
    leftEyeY: event.eyeXY.leftEyeY,
  };

  delete eventObject.eyeXY;

  // console.log(
  //   'remapEventObject Before Sort:',
  //   eventObject ? 1 : 0,
  //   sortOrder ? 1 : 0,
  //   typeof eventObject,
  //   eventObject,
  // );
  // Sort based on the sortOrder array
  eventObject = sortObjectByKeysOrder(eventObject, sortOrder);

  // console.log(
  //   'remapEventObject After Sort:',
  //   eventObject ? 1 : 0,
  //   typeof eventObject,
  //   eventObject,
  // );
  return eventObject;
};
