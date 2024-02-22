import { StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';
import BaseSetting from '@config/setting';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentView: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  gText: { fontSize: 15, fontWeight: '500' },
  inputcontainer: {
    flex: 0.4,
    justifyContent: 'center',
  },
  forgotPasswordTextStyle: {
    color: BaseColors.primary,
  },
  signinbutton: { flex: 1 },
  btnContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  img: {
    height: 50,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginVertical: 10,
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 50,
    borderRadius: 10,
    width: '70%',
  },
  fingIcon: {
    marginLeft: 20,
    backgroundColor: BaseColors.primary,
    padding: 8,
    borderRadius: 50,
    color: BaseColors.white,
  },
  outer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gBtnWrapper: {
    borderRadius: 50,
    padding: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  gBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: BaseSetting.nHeight * 0.06,
    paddingHorizontal: 7,
    marginRight: 7,
  },
  cover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});
