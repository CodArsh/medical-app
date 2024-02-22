import { ScrollView, View } from 'react-native';
import React from 'react';
import styles from './styles';

import HeaderBar from '@components/HeaderBar';
import { useSelector } from 'react-redux';
import { BaseColors } from '@config/theme';

const PrivacyPolicy = () => {
  const { darkmode } = useSelector(state => {
    return state.auth;
  });
  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HeaderBar HeaderText={'privacy Policy'} HeaderCenter leftText="Back" />
      <View style={{ marginTop: 3 }} />
    </ScrollView>
  );
};

export default PrivacyPolicy;
