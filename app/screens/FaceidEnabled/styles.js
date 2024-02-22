import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 20,
  },
  logoView: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: { width: 100 },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    height: 55,
    width: '100%',
  },
  dropdownContainer: {
    justifyContent: 'center',
    marginTop: 50,
  },
  genderBox: {
    borderRadius: 10,
    borderColor: BaseColors.black20,
    borderWidth: 1,
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 6,
    zIndex: 50,
    backgroundColor: BaseColors.white,
  },
  genderTitle: {
    marginTop: 8,
    color: BaseColors.black,
    fontFamily: FontFamily.regular,
  },
  skip: {
    marginTop: 20,
    fontSize: 18,
    color: BaseColors.primary,
    fontFamily: FontFamily.regular,
  },
  errorText: {
    color: BaseColors.red,
    marginTop: 5,
    fontFamily: FontFamily.regular,
    marginLeft: 5,
  },
  inputContainer: {
    marginTop: 10,
    borderRadius: 10,
    borderColor: BaseColors.black20,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: BaseColors.white,
  },
  inputText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 16,
  },
});
