import { StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 20,
  },
  contentView: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputcontainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
  },
  forgotPasswordTextStyle: {
    fontSize: 17,
    marginTop: 10,
    color: BaseColors.primary,
  },
  sendemail: {
    height: 55,
    width: '100%',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  container2: {
    marginBottom: 15,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioTop: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BaseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  optionsContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
});
