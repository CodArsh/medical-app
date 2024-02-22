import React from 'react';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';

/**
 *Display status Bar
 * @function CStatusBar
 */
export default function CStatusBar() {
  const { darkmode } = useSelector(state => state.auth);
  return (
    <StatusBar
      backgroundColor={darkmode ? BaseColors.lightBlack : BaseColors.white}
      barStyle={darkmode ? 'light-content' : 'dark-content'}
    />
  );
}
