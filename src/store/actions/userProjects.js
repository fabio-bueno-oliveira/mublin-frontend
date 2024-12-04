import { userProjectsTypes } from '../types/userProjects';
import { userService } from '../../api/users';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const userProjectsInfos = {
  getUserProjects: getUserProjects,
  getUserProjectsBasicInfo: getUserProjectsBasicInfo,
};

function getUserProjects(id,type) {
  return dispatch => {
    dispatch(request(id));

    userService.getUserProjects(id,type)
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(id, error.toString()))
      );
  };

  function request(id) { return { type: userProjectsTypes.GET_USER_PROJECTS_REQUEST, id } }
  function success(list) { return { type: userProjectsTypes.GET_USER_PROJECTS_SUCCESS, list } }
  function failure(id, error) { return { type: userProjectsTypes.GET_USER_PROJECTS_FAILURE, id, error } }
}

function getUserProjectsBasicInfo(id) {
  return dispatch => {
    dispatch(request(id));

    userService.getUserProjectsBasicInfo(id)
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(id, error.toString()))
      );
  };

  function request(id) { return { type: userProjectsTypes.GET_USER_PROJECTS_BASIC_INFO_REQUEST, id } }
  function success(list) { return { type: userProjectsTypes.GET_USER_PROJECTS_BASIC_INFO_SUCCESS, list } }
  function failure(id, error) { return { type: userProjectsTypes.GET_USER_PROJECTS_BASIC_INFO_FAILURE, id, error } }
}