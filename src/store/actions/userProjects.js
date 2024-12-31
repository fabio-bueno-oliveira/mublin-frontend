import { userProjectsTypes } from '../types/userProjects';
import { userService } from '../../api/users';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const userProjectsInfos = {
  getUserProjects: getUserProjects,
  getUserProjectsBasicInfo: getUserProjectsBasicInfo,
};

function getUserProjects(userId,type) {
  return dispatch => {
    dispatch(request(userId));

    userService.getUserProjects(userId,type)
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(userId, error.toString()))
      );
  };

  function request(userId) { return { type: userProjectsTypes.GET_USER_PROJECTS_REQUEST, userId } }
  function success(list) { return { type: userProjectsTypes.GET_USER_PROJECTS_SUCCESS, list } }
  function failure(userId, error) { return { type: userProjectsTypes.GET_USER_PROJECTS_FAILURE, userId, error } }
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