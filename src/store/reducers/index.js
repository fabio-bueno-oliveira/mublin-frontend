import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { user } from './user';
import { userProjects } from './userProjects';
import { feed } from './feed';
import { search } from './search';
import { searchProject } from './searchProject';
import { projectUsernameCheck } from './projectUsernameCheck';
import { profile } from './profile';
import { followedByMe } from './follow';
import { brand } from './brand';
import { gear } from './gear';
import { project } from './project';
import { events } from './events';
import { emailCheck } from './emailCheck';
import { usernameCheck } from './usernameCheck';
import { musicGenres } from './musicGenres';
import { roles } from './roles';
import { availabilityOptions } from './availabilityOptions';
import { jobs } from './jobs';

const rootReducer = combineReducers({
  authentication,
  user,
  userProjects,
  feed,
  search,
  searchProject,
  profile,
  followedByMe,
  brand,
  gear,
  project,
  projectUsernameCheck,
  events,
  emailCheck,
  usernameCheck,
  musicGenres,
  roles,
  availabilityOptions,
  jobs
});

export default rootReducer;