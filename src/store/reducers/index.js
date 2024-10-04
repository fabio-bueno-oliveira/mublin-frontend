import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { user } from './user';
import { profile } from './profile';
import { emailCheck } from './emailCheck';
import { usernameCheck } from './usernameCheck';

const rootReducer = combineReducers({
  authentication,
  user,
  profile,
  emailCheck,
  usernameCheck
});

export default rootReducer;