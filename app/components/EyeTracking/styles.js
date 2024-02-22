import { BaseColors } from '@config/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  debugBar: {
    position: 'absolute',
    zIndex: 111,
    backgroundColor: '#FFF5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BaseColors.borderColor,
    bottom: 20,
    left: 10,
    right: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  infoScroll: {
    flex: 1,
    height: 70,
  },
  infoRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  dlabel: {
    fontSize: 10,
    color: BaseColors.black,
    textAlign: 'center',
    paddingBottom: 5,
  },
  dvalue: {
    fontSize: 12,
    color: BaseColors.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionHide: {
    color: BaseColors.textGrey,
  },
  dActions: {
    borderLeftWidth: 1,
    borderLeftColor: BaseColors.inactive,
    paddingLeft: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default styles;
