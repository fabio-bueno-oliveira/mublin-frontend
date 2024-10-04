import { authenticationTypes } from '../types/authentication';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : { loggedIn: false, loggingIn: false, error: null } ;

export function authentication(state = initialState, action) {
  switch (action.type) {
    case authenticationTypes.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case authenticationTypes.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        loggingIn: false,
        user: action.user
      };
    case authenticationTypes.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        error: action.error
      };
    case authenticationTypes.LOGOUT:
      return {};
    default:
      return state
  }
}