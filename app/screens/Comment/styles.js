import { BaseColors, FontFamily } from '@config/theme';
import { Dimensions, StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.white,
  },
  topTitle: { paddingHorizontal: 15 },
  main: {
    paddingHorizontal: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
  },
  titleOne: {
    color: BaseColors.black,
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleThree: { fontSize: 15 },
  titleTwo: { fontSize: 15, marginTop: 5 },
  inputBar: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: BaseColors.black30,
    borderRadius: 15,
    height: 150,
    padding: 15,
    textAlignVertical: 'top',
  },
  doneBtn: { width: '90%', paddingHorizontal: 25 },
  innerView: { marginVertical: Dimensions.get('screen').height / 15 },

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
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
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
export default styles;
