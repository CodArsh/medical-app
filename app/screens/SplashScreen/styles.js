import { Dimensions, Platform, StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const nWidth = Dimensions.get('screen').width;
const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  container: {
    backgroundColor: BaseColors.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 55,
  },
});
