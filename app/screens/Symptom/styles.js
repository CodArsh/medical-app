import { Dimensions, StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: BaseColors.white,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  titlesubText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
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
  btnContainer: {
    height: windowHeight / 5,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  img2: {
    height: 200,
    width: 200,
  },
  scrollViewStyle: {
    flexGrow: 1,
    paddingTop: 30,
    paddingHorizontal: 25,
    marginTop: 1,
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
