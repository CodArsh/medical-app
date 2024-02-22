import React from 'react';
import DebugBar from './DebugBar';

export default function EyeTracking(props) {
  // console.log(props);
  const { debug, debugData } = props;
  return debug && <DebugBar debugData={debugData} />;
}
