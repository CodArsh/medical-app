import { BaseColors, FontFamily } from '@config/theme';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: BaseColors.lightBg,
  },
  mainDiv: {
    flex: 1,
    backgroundColor: BaseColors.white,
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginVertical: 20,
    paddingHorizontal: 25,
    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: 'center',
  },

  titleText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    fontFamily: FontFamily.bold,
    color: BaseColors.textColor,
    textAlign: 'center',
  },
  subtitleText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    // marginTop: 15,
    fontFamily: FontFamily.bold,
    color: BaseColors.textColor,
  },

  numbercontainer: {
    width: '80%',
    height: 90,
    borderRadius: 12,
    borderColor: BaseColors.borderColor,
    textAlign: 'center',
    padding: 24,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    fontFamily: FontFamily.bold,
    color: BaseColors.textColor,
  },
  errorTxt: {
    color: '#FF0B1E',
    paddingLeft: 5,
    paddingBottom: 12,
    marginTop: 10,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
  },

  confirmmodaltitleText: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  confirmmodalText: {
    color: BaseColors.textColor,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: BaseColors.primary,
  },
  cancelButton: {
    backgroundColor: BaseColors.secondary,
  },
  buttonText: {
    color: BaseColors.white,
    fontWeight: 'bold',
  },

  confirmationModalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColors.black50,
  },
  confirmationModalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  confirmationModalTitleText: {
    fontSize: 18,
    color: BaseColors.textColor,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmationModalText: {
    color: BaseColors.textColor,
    marginBottom: 20,
  },
});
