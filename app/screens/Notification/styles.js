import { BaseColors, FontFamily } from '@config/theme';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: BaseColors.lightBg,
  },
  container: {
    height: 60,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeDelete: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
  },
  rightAction: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  reload: {
    backgroundColor: BaseColors.primary,
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 5,
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
  noDataView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
