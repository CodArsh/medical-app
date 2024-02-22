import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    borderWidth: 1,
    marginVertical: 5,
    borderColor: BaseColors.lightGrey,
    width: '95%',
    height: 90,
    padding: 10,
    borderRadius: 12,
    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
 
  },
  img: { height: 25, width: 23 },
  img2: { width: 110 },
  text: {
    // color: BaseColors.textColor,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
  numbercontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  graphcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  number: {
    color: BaseColors.secondary,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 36,
    marginRight: 2,
  },
});
