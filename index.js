/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

const App = require('./app/Entrypoint').default;

AppRegistry.registerComponent(appName, () => App);
