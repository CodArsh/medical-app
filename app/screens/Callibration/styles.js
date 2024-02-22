import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import BaseSetting from '@config/setting';

const styles = StyleSheet.create({
  main: { flex: 1 },
  imgStyle: { height: '100%', width: '100%', position: 'absolute' },
  imgStylee: { height: '90%', width: '100%', marginHorizontal: 10 },
  statusBox: { flexDirection: 'row', marginTop: 5 },
  requestBtn: {
    width: '80%',
    marginTop: 50,
  },
  squareBorder: {
    height: 170,
    width: BaseSetting.nWidth,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  outerText: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: BaseColors.black30,
    backgroundColor: BaseColors.black30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 18,
    borderRadius: 5,
  },
  rightLine: {
    height: '80%',
    borderRightWidth: 1,
    marginHorizontal: 5,
    borderRightColor: BaseColors.black50,
  },
  smalltext: {
    textAlign: 'center',
    color: BaseColors?.white,
    fontFamily: FontFamily.regular,
    fontSize: 14,
  },
  bigtext: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
    color: BaseColors?.white,
    fontFamily: FontFamily.regular,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  plusStyle: {
    position: 'absolute',
    color: BaseColors?.white,
    fontSize: 40,
    top: '50%',
  },
  dotContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  smallDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BaseColors?.primaryBlue,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    height: BaseSetting.nHeight / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: BaseColors.black40,
    borderRadius: 10,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topIn: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 20, fontWeight: 'bold' },
  miniTitle: { fontSize: 16 },
  swipeCover: {
    width: '100%',
    height: BaseSetting.nHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  post1: {
    paddingTop: BaseSetting.nHeight / 20,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '90%',
    paddingLeft: 15,
  },
  post2: {
    paddingTop: BaseSetting.nHeight / 20,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '90%',
    paddingLeft: 15,
  },
  desc: { alignItems: 'center', width: '100%' },
  btnStyle: { width: '70%', borderRadius: 50, marginTop: 25 },
  successOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successImg: {
    height: 310,
    width: 340,
  },
  successText: { fontSize: 16, marginVertical: 10 },
  textOuter: {
    marginVertical: 15,
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  activeUpper: {
    height: 15,
    width: 15,
    backgroundColor: BaseColors.primary,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: BaseColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeInner: {
    height: 12,
    width: 12,
    backgroundColor: BaseColors.primary,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: BaseColors.white,
  },
  inActiveUpper: {
    height: 12,
    width: 12,
    marginTop: 1.5,
    backgroundColor: BaseColors.textGrey,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: BaseColors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inActiveInner: {
    height: 12,
    width: 12,
    backgroundColor: BaseColors.textSecondary,
    borderRadius: 50,
    borderColor: BaseColors.textSecondary,
  },
  dotWrapper: {
    flexDirection: 'row',
    marginBottom: 5,
    width: BaseSetting.nWidth / 12,
    justifyContent: 'space-between',
  },
});

export default styles;