import { combineReducers } from 'redux';
import { profile } from './profile';
import { emailCheck } from './emailCheck';
import { usernameCheck } from './usernameCheck';

const rootReducer = combineReducers({
  profile,
  emailCheck,
  usernameCheck
});

export default rootReducer;