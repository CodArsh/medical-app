import { Dimensions, Platform, StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  contentView: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputcontainer: {
    flex: 0.4,
    // justifyContent: 'flex-start',
  },
  forgotPasswordTextStyle: {
    marginTop: 10,
    marginBottom: 30,
    color: BaseColors.primary,
  },
  save: {
    height: 55,
    width: '100%',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  img: {
    marginTop: 40,
    height: 55,
    width: '90%',
  },
  socialBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColors.backgroundPlaceholder,
    marginBottom: 8,
    paddingVertical: 8,
    borderRadius: 5,
  },
  twofa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  twofaTExt: {
    fontFamily: FontFamily?.regular,
    fontSize: 16,
  },
});
