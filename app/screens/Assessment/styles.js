import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  main: {
    backgroundColor: BaseColors.white,
    flexGrow: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  titlesubText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.textColor,
  },
  titledetail: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    // flex: 0.6,
  },
  Assessment: { width: '80%' },
});
