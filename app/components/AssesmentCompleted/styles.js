import { BaseColors, FontFamily } from '@config/theme';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: BaseColors.white,
  },
  mainDiv: {
    flex: 1,
    marginVertical: 30,
    paddingHorizontal: 25,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginTop: 15,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
  },
  buttoncontainer: {
    flex: 0.3,
    marginHorizontal: 25,
    justifyContent: 'flex-end',
  },
  textInputContainer: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: BaseColors.borderColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  textInput: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
  },
});
