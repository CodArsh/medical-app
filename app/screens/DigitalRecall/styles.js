import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  main: {
    flex: 1,
  },
  titleText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.textColor,
  },
  titlesubText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
  },
  example: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  subtitleText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
    marginBottom: 25,
  },
  titledetail: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
  },

  dotwithbordercontainer: {
    marginTop: 10,
    flexDirection: 'row',
    width: '25%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  round: {
    height: 12,
    width: 12,
    borderRadius: 50,
  },
  dot: {
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    height: 55,
    width: '100%',
  },
  topcontainer: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    marginTop: 2,
    backgroundColor: BaseColors.white,
  },
  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});
