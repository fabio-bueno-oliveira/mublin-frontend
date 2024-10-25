import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { user } from './user';
import { userProjects } from './userProjects';
import { search } from './search';
import { profile } from './profile';
import { followedByMe } from './follow';
import { gear } from './gear';
import { project } from './project';
import { events } from './events';
import { emailCheck } from './emailCheck';
import { usernameCheck } from './usernameCheck';

const rootReducer = combineReducers({
  authentication,
  user,
  userProjects,
  search,
  profile,
  followedByMe,
  gear,
  project,
  events,
  emailCheck,
  usernameCheck
});

export default rootReducer;