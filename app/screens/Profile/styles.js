import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const fullWidth = '100%';
export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: BaseColors.white,
  },
  genderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: BaseColors.black20,
    borderWidth: 1,
    marginTop: 10,
  },
  genderIcon: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabBox: { width: fullWidth },
  customGender: {
    backgroundColor: BaseColors.white,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '85%',
  },
  cardOuter: {
    width: fullWidth,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  alignSetup: { width: '100%', alignItems: 'center' },
  dateTitle: { color: BaseColors.black, marginBottom: 10 },
  dateBox: {
    backgroundColor: BaseColors.white,
    borderColor: BaseColors.black20,
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  leftImagem: { height: 20, width: 22 },
  editContainer: {
    backgroundColor: BaseColors.white,
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  // screen: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F2F5FB',
  // },
  headertext: {
    fontSize: 20,
    color: BaseColors.black,
  },
  text: {
    fontSize: 16,
    color: BaseColors.black,
  },
  picker: {
    marginVertical: 30,
    borderRadius: 10,
    color: BaseColors.black,
    width: '100%',
    borderColor: BaseColors.black20,
    borderWidth: 1,
  },
  genderTitle: {
    marginTop: 8,
    color: BaseColors.black,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColors.black60,
  },
  modalHead: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 340,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  containers: {
    marginBottom: 20,
    width: '60%',
  },
  closeicon: { padding: 10, position: 'absolute', right: 4 },

  dropdownContainer: {
    margin: 20,
    borderRadius: 10,
    borderColor: BaseColors.black20,
    borderWidth: 1,
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 6,
    zIndex: 50,
    backgroundColor: BaseColors.white,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownList: {
    backgroundColor: '#fafafa',
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#333',
  },
  confirmmmodalcenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColors.black50,
  },
  confirmmmodalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BaseColors.black50,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: BaseColors.primary,
  },
  additionalSportsContainer: {
    maxHeight: 200, // Limit height to prevent overflowing
    overflow: 'scroll', // Enable scrolling if content overflows
  },

  list: { color: BaseColors.textColor, fontSize: 16 },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dot: {
    fontSize: 22,
    marginRight: 5,
    color: BaseColors.textColor,
  },
});
