import { projectUsernameCheckTypes } from '../types/projectUsernameCheck';

const initialState = {
  requesting: false,
  requested: false,
  available: '',
  message: '',
  error: ''
}

export function projectUsernameCheck(state = initialState, action) {
  switch (action.type) {
    case projectUsernameCheckTypes.CHECK_PROJECTUSERNAME_REQUEST:
      return {
        ...state,
        requested: false,
        requesting: true
      };
    case projectUsernameCheckTypes.CHECK_PROJECTUSERNAME_SUCCESS:
      return {
        ...state,
        requested: true,
        requesting: false,
        available: action.info.available,
        message: action.info.message
      };
    case projectUsernameCheckTypes.CHECK_PROJECTUSERNAME_FAILURE:
      return {
        ...state,
        requested: true,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}