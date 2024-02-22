import LottieView from 'lottie-react-native';
import React from 'react';

export default function MainLoader(props) {
  const { height = 250, width = 250 } = props;
  return (
    <LottieView
      source={require('../../assets/Lottie/heartLoader.json')}
      autoPlay
      loop
      style={{ height: height, width: width }}
    />
  );
}
