import { StyleSheet, Platform } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import BaseSetting from '@config/setting';

const IOS = Platform.OS === 'ios';
const styles = StyleSheet.create({
  main: {
    borderWidth: 1,
    marginVertical: 5,
    width: '100%',
    borderRadius: 5,
    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: 90,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: BaseColors.white,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotContainer: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // backgroundColor: BaseColors.primary,
    position: 'absolute',
    top: 6,
    left: 1,
  },
  container: {
    width: '95%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  insideBox: { flexDirection: 'row', alignItems: 'center' },
  imgStyle: { height: 50, width: 50, borderRadius: 50 },
  statusBox: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
  },
  chipBox: {
    height: 30,
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  colorcontainer: {
    width: 8,
    height: 8,
    borderRadius: 50,
    alignSelf: 'center',
    marginRight: 10,
  },
});

export default styles;
