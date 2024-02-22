import {combineReducers} from 'redux';
import auth from './auth/reducer';
import language from './language/reducer';
import notification from './notification/reducer';
import eyeTracking from './eyeTracking/reducer';

const rootReducer = combineReducers({
  auth,
  language,
  notification,
  eyeTracking,
});

export default rootReducer;
