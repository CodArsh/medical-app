import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  commonLineChartContainer: {
    flex: 1,
    marginLeft: -15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: BaseColors.textColor,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  eventContainer: {
    borderWidth: 1,
    width: '48%', // Two items side by side with a small gap
    marginVertical: 6,
    borderColor: BaseColors.lightGrey,
    height: 100,
    padding: 10,
    borderRadius: 12,
    elevation: 3,

    shadowColor: BaseColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 5,
    alignItems: 'center',
  },
  textt: {
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: BaseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
