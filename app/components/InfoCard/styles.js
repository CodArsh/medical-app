import { BaseColors, FontFamily } from '@config/theme';
import { Platform, StyleSheet } from 'react-native';
const IOS = Platform.OS === 'ios';

const fullWidth = '100%';
export default StyleSheet.create({
  settigCon: {
    marginTop: 5,
    width: fullWidth,
    borderRadius: 10,
  },
  mainTitleStyle: {
    alignItems: 'flex-start',
  },
  userDp: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 20,
    elevation: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    margin: 10,
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    // color: BaseColors.black,
  },
  infoshadow: {
    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  settingItem: {
    backgroundColor: 'white',
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topBorder: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  otherBorder: {
    borderTopWidth: 0.7,
    borderColor: BaseColors.borderColor,
  },
  radiusDesign: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  innerCard: {
    width: 20,
    marginRight: 10,
  },
  settingItemText: {
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: FontFamily.regular,
  },
  righttitletextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  righttitletext: {
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'left',
    fontFamily: FontFamily.regular,
    alignItems: 'center',
  },
});
