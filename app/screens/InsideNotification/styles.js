import { BaseColors } from '@config/theme';

const { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  date: {
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
  },
});
export default styles;
