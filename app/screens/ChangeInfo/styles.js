import { BaseColors, FontFamily } from '@config/theme';
import { Dimensions, StyleSheet } from 'react-native';
const windowHeight = Dimensions.get('window').height;

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
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
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
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },

  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: FontFamily.regular,
    color: BaseColors.black,
  },
  yesText: {
    fontWeight: '400',
    lineHeight: 22,
    fontFamily: FontFamily.regular,
    color: BaseColors.white,
  },

  noText: {
    fontWeight: '400',
    lineHeight: 22,
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
  },

  buttoncontainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },

  yesbutton: {
    paddingHorizontal: 30,
    height: 34,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BaseColors.black20,
  },
  nobutton: {
    paddingHorizontal: 30,
    height: 34,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BaseColors.black20,
  },
  btnContainer: {
    marginTop: 10,
    justifyContent: 'flex-end',
    // height: windowHeight / 4.2,
  },
  errorText: {
    color: BaseColors.red,
    paddingBottom: 10,
  },
  inputBar: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: BaseColors.black30,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
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
});
