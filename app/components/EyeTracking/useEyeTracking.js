import React, { useEffect } from 'react';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import { getDate } from '@utils/CommonFunction';

export const DEFAULT_OPTIONS = {
  debug: false,
  tracking: false,
  eyePos: false,
  showDebug: () => {},
  startTracking: () => {},
  startEyePos: () => {},
  props: {},
};

export function useEyeTracking({ defaultOptions }) {
  const [isDebug, setIsDebug] = React.useState(false);
  const [isTracking, setIsTracking] = React.useState(false);
  const [isEyePosTracking, setIsEyePosTracking] = React.useState(false);
  const [debugData, setDebugData] = React.useState({});
  //   const initialOptions = mergeIfDefined(DEFAULT_OPTIONS, defaultOptions);
  //   const [options, setOptions] = React.useState(initialOptions);
  const showDebug = React.useCallback(show => {
    setIsDebug(show);
  }, []);
  const startTracking = React.useCallback(start => {
    setIsTracking(start);
  }, []);
  const startEyePos = React.useCallback(start => {
    setIsEyePosTracking(start);
  }, []);
  const setDebugInfo = React.useCallback(debugInfo => {
    setDebugData(debugInfo);
  }, []);

  useEffect(() => {
    // Define Track Listener Function
    // Setup Emitter based on Device OS
    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(NativeModules.EyeTrackingEventEmitter)
        : DeviceEventEmitter;

    const trackListener = event => {
      event.timestamp = getDate();
      // console.log('Listeniing from EyeTracking CMP', event);
      DeviceEventEmitter.emit('eyeTrackingEvent', event);
      setDebugData(event);
    };

    // Let's listen to Tracking Event
    const subscription = emitter.addListener('tracking', trackListener);

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isDebug,
    isTracking,
    isEyePosTracking,
    debugData,
    setDebugInfo,
    showDebug,
    startTracking,
    startEyePos,
  };
}
