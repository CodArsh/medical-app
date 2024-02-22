import { Platform, StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
const IOS = Platform.OS === 'ios';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    width: '90%',
    height: 300,
  },
  homeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the opacity as needed
  },

  main: {
    flex: 1,
    // backgroundColor: BaseColors.white,
    alignItems: 'center',
  },
  topBar: {
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
    marginTop: IOS ? 55 : 30,
    justifyContent: 'space-between',
  },
  title: {
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    width: '100%',
  },
  rta: {
    fontWeight: 'bold',
    color: BaseColors.primary,
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: BaseColors.primary,
  },
  welcomeText: {
    fontSize: 14,
  },
  summaryArea: {
    flex: 1,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  summaryText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  descText: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 17,
  },
  requestBtn: {
    marginVertical: 15,
    width: '80%',
  },
  detailsArea: {
    flex: 1,
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
