import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { user } from './user';
import { userProjects } from './userProjects';
import { search } from './search';
import { searchProject } from './searchProject';
import { profile } from './profile';
import { followedByMe } from './follow';
import { gear } from './gear';
import { project } from './project';
import { events } from './events';
import { emailCheck } from './emailCheck';
import { usernameCheck } from './usernameCheck';
import { musicGenres } from './musicGenres';
import { roles } from './roles';

const rootReducer = combineReducers({
  authentication,
  user,
  userProjects,
  search,
  searchProject,
  profile,
  followedByMe,
  gear,
  project,
  events,
  emailCheck,
  usernameCheck,
  musicGenres,
  roles
});

export default rootReducer;