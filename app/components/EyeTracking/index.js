import React from 'react';
import { Text, View } from 'react-native';
import { useEyeTracking } from './useEyeTracking';
import EyeTrackingUI from './EyeTrackingUI';

const EyeTrackingRoot = React.forwardRef((props, ref) => {
  const { config, ...defaultOptions } = props;
  const {
    showDebug,
    startTracking,
    startEyePos,
    setDebugInfo,
    debugData,
    isDebug,
    isTracking,
    isEyePosTracking,
  } = useEyeTracking({
    defaultOptions,
  });
  React.useImperativeHandle(
    ref,
    React.useCallback(
      () => ({
        showDebug,
        startTracking,
        startEyePos,
        setDebugInfo,
      }),
      [showDebug, startTracking, startEyePos, setDebugInfo],
    ),
  );
  return (
    <EyeTrackingUI
      debug={isDebug}
      tracking={isTracking}
      eyePos={isEyePosTracking}
      debugData={debugData}
    />
  );
});

let eyeTrackRef = null;

export function EyeTracking(props) {
  const eyeTrackingRef = React.useRef(null);
  const setRef = React.useCallback(ref => {
    // Since we know there's a ref, we'll update `refs` to use it.
    if (ref) {
      // store the ref in this toast instance to be able to remove it from the array later when the ref becomes null.
      eyeTrackingRef.current = ref;
      eyeTrackRef = ref;
    } else {
      eyeTrackRef = null;
    }
  }, []);
  return <EyeTrackingRoot ref={setRef} {...props} />;
}

EyeTracking.showDebug = params => {
  if (eyeTrackRef) {
    eyeTrackRef.showDebug(params);
  }
};

EyeTracking.setDebugInfo = params => {
  if (eyeTrackRef) {
    eyeTrackRef.setDebugInfo(params);
  }
};

export default EyeTracking;
