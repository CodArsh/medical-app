import { StyleSheet } from 'react-native';

const { FontFamily, BaseColors } = require('@config/theme');

export default StyleSheet.create({
  main: {
    // marginHorizontal: 20,
  },
  labelCon: {
    alignSelf: 'flex-start',
    marginBottom: 3,
    flexDirection: 'row',
  },
  labelTxt: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    textTransform: 'capitalize',
    marginRight: 3,
  },
  astrick: {
    fontFamily: FontFamily.regular,
    color: BaseColors.red,
    position: 'absolute',
    top: -3,
    right: -5,
  },
});
