import { followTypes } from '../types/follow';

const initialState = {
  requesting: false,
  id: '',
  following: '',
  inspiration: ''
}

export function followedByMe(state = initialState, action) {
  switch (action.type) {
    case followTypes.GET_FOLLOWEDBYME_REQUEST:
      return {
        ...state,
        error: '',
        requesting: true
      };
    case followTypes.GET_FOLLOWEDBYME_SUCCESS:
      return {
        ...state,
        requesting: false,
        id: action.info.id,
        following: action.info.following,
        inspiration: action.info.inspiration,
      };
    case followTypes.GET_FOLLOWEDBYME_FAILURE:
      return {
        ...state,
        requesting: false,
        id: '',
        following: '',
        inspiration: '',
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}