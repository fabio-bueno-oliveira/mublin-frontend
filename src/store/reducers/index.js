import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { user } from './user';
import { userProjects } from './userProjects';
import { profile } from './profile';
import { project } from './project';
import { events } from './events';
import { emailCheck } from './emailCheck';
import { usernameCheck } from './usernameCheck';

const rootReducer = combineReducers({
  authentication,
  user,
  userProjects,
  profile,
  project,
  events,
  emailCheck,
  usernameCheck
});

export default rootReducer;