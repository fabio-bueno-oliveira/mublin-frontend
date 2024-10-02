import { usernameCheckTypes } from '../types/usernameCheck';
import { projectUsernameCheckTypes } from '../types/projectUsernameCheck';
import { usernameCheckService } from '../../api/usernameCheck';

export const usernameCheckInfos = {
    checkUsernameByString: checkUsernameByString,
    checkProjectUsernameByString: checkProjectUsernameByString
};

function checkUsernameByString(string) {
  return dispatch => {
      dispatch(request(string));

      usernameCheckService.checkUsernameByString(string)
          .then(
              info => dispatch(success(info)),
              error => dispatch(failure(string, error.toString()))
          );
  };

  function request(string) { return { type: usernameCheckTypes.CHECK_USERNAME_REQUEST, string } }
  function success(info) { return { type: usernameCheckTypes.CHECK_USERNAME_SUCCESS, info } }
  function failure(string, error) { return { type: usernameCheckTypes.CHECK_USERNAME_FAILURE, string, error } }
}

function checkProjectUsernameByString(string) {
    return dispatch => {
        dispatch(request(string));
  
        usernameCheckService.checkProjectUsernameByString(string)
            .then(
                info => dispatch(success(info)),
                error => dispatch(failure(string, error.toString()))
            );
    };
  
    function request(string) { return { type: projectUsernameCheckTypes.CHECK_PROJECTUSERNAME_REQUEST, string } }
    function success(info) { return { type: projectUsernameCheckTypes.CHECK_PROJECTUSERNAME_SUCCESS, info } }
    function failure(string, error) { return { type: projectUsernameCheckTypes.CHECK_PROJECTUSERNAME_FAILURE, string, error } }
  }