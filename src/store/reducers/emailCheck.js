import { emailCheckTypes } from '../types/emailCheck';

const initialState = {
  requesting: false,
  available: '',
  message: '',
  error: ''
}

export function emailCheck(state = initialState, action) {
  switch (action.type) {
    case emailCheckTypes.CHECK_EMAIL_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case emailCheckTypes.CHECK_EMAIL_SUCCESS:
      return {
        ...state,
        requesting: false,
        available: action.info.available,
        message: action.info.message
      };
    case emailCheckTypes.CHECK_EMAIL_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}