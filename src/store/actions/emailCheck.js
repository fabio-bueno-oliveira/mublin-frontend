import { emailCheckTypes } from '../types/emailCheck';
import { usernameCheckService } from '../../api/usernameCheck';

export const emailCheckInfos = {
    checkEmailByString: checkEmailByString
};

function checkEmailByString(string) {
  return dispatch => {
      dispatch(request(string));

      usernameCheckService.checkEmailByString(string)
          .then(
              info => dispatch(success(info)),
              error => dispatch(failure(string, error.toString()))
          );
  };

  function request(string) { return { type: emailCheckTypes.CHECK_EMAIL_REQUEST, string } }
  function success(info) { return { type: emailCheckTypes.CHECK_EMAIL_SUCCESS, info } }
  function failure(string, error) { return { type: emailCheckTypes.CHECK_EMAIL_FAILURE, string, error } }
}