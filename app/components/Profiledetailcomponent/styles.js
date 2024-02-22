import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const fullWidth = '100%';
export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: BaseColors.lightBg,
    alignItems: 'center',
  },
  settigCon: {
    marginTop: 15,
    marginHorizontal: 20,
    width: fullWidth,
    zIndex: 2,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mainModal: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  imgText: { fontSize: 15, marginLeft: 5, color: BaseColors.primary },
  imgType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devider: {
    borderBottomWidth: 1,
    borderColor: BaseColors.black50,
    marginVertical: 15,
  },
  topBorder: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  otherBorder: {
    borderTopWidth: 0.7,
    borderColor: BaseColors.borderColor,
  },
  userDp: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 20,
  },
  genderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: BaseColors.black20,
    borderWidth: 1.2,
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
  },
  sportbox: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,

    marginTop: 10,
  },
  genderIcon: {
    height: 50,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  errorTxt: {
    color: BaseColors.red,
    paddingLeft: 5,
    marginTop: 5,
    fontFamily: FontFamily.regular,
    fontSize: 14,
  },
  profilePic: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 1,
  },
  settingItem: {
    backgroundColor: 'white',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  radiusDesign: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBox: { backgroundColor: BaseColors.white, width: fullWidth },
  innerCard: {
    width: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  mainTitleStyle: {
    alignItems: 'flex-start',
  },
  customGender: {
    backgroundColor: BaseColors.white,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '85%',
    borderWidth: 1,
  },
  cardOuter: {
    width: fullWidth,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: FontFamily.bold,
    color: BaseColors.black,
  },
  settingItemText: {
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    color: BaseColors.black90,
  },
  alignSetup: { width: '100%', alignItems: 'center' },
  righttitletext: {
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    color: BaseColors.textColor,
    alignItems: 'center',
  },
  dateTitle: { color: BaseColors.black, marginBottom: 10 },
  dateBox: {
    borderWidth: 1,
    height: 50,
    elevation: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  leftImagem: { height: 20, width: 22 },
  editContainer: {
    // backgroundColor: BaseColors.white,
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
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
    // color: BaseColors.black,
    fontFamily: FontFamily.regular,
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
  topBar: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderImage: {
    height: 120,
    width: 120,
    borderRadius: 60,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA', // Customize the background color for the placeholder
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: 300,
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
  imagePickerButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: BaseColors.primary,
    top: -35,
    left: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerButtonText: {
    color: BaseColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
