import BaseSetting from '@config/setting';
import { BaseColors, FontFamily } from '@config/theme';
import { Platform, StyleSheet } from 'react-native';
const IOS = Platform.OS === 'ios';

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  option: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  imageView: {
    fill: BaseColors.primary,
    stroke: BaseColors.primary,
    strokeWidth: 15,
    strokeMiterlimit: 10,
  },
  box1: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: '#7DD4C6',
  },
  box2: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: BaseColors.primary,
  },
  upper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerBox: {
    flex: 1,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 8,
  },
  page: {
    fontSize: 15,
    zIndex: 5,
    position: 'absolute',
    top: 600,
    right: BaseSetting.nWidth / 10,
  },
  hi_msg: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  init: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
  },
  chart: {
    width: '90%',
    height: 300,
  },
  main: {
    flex: 1,
    // backgroundColor: BaseColors.white,
    alignItems: 'center',
  },
  topBar: {
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    marginTop: IOS ? 55 : 30,
    justifyContent: 'space-between',
  },
  title: {
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: '100%',
  },
  rta: {
    fontWeight: 'bold',
    color: BaseColors.primary,
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: BaseColors.primary,
  },
  welcomeText: {
    fontSize: 14,
  },
  summaryArea: {
    flex: 1,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  descText: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 17,
  },
  requestBtn: {
    marginVertical: 15,
    width: '80%',
    alignSelf: 'center',
  },
  detailsArea: {
    flex: 1,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
