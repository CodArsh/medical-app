import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: BaseColors.white,
  // },
  imagecontainer: { paddingVertical: 10, alignItems: 'center' },
  img: { width: 33, height: 31 },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  listContainer: {
    marginHorizontal: 10,
    marginTop: 15,
    paddingBottom: 20,
  },
  text: {
    fontFamily: FontFamily.roRegular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: BaseColors.secondary,
  },
  maincontainer: {
    // backgroundColor: 'white',
    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  imgs: { height: 25, width: 23 },
  img2: { width: 110 },
  textt: {
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
