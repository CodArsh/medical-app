import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { BaseColors } from '@config/theme';

const NoData = ({ title }) => {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  main: {
    height: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginTop: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: BaseColors.primary,
  },
});
