import { usernameCheckTypes } from '../types/usernameCheck';

const initialState = {
  requesting: false,
  available: '',
  message: '',
  error: ''
}

export function usernameCheck(state = initialState, action) {
  switch (action.type) {
    case usernameCheckTypes.CHECK_USERNAME_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case usernameCheckTypes.CHECK_USERNAME_SUCCESS:
      return {
        ...state,
        requesting: false,
        available: action.info.available,
        message: action.info.message
      };
    case usernameCheckTypes.CHECK_USERNAME_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}