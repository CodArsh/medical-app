import { BaseColors } from '@config/theme';

const { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    alignItems: 'center',
  },
  insideBox: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'space-between',
    paddingVertical: 25,
  },
  cart: {
    marginVertical: 25,
    backgroundColor: BaseColors.black10,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
  },
  text: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  dropBox: {
    borderWidth: 1,
    borderColor: BaseColors.black60,
    borderRadius: 5,
  },
  save: { width: '90%' },
});

export default styles;
