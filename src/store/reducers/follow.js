import { followTypes } from '../types/follow';

const initialState = {
  requesting: false,
  following: '',
  id: ''
}

export function followedByMe(state = initialState, action) {
  switch (action.type) {
    case followTypes.GET_FOLLOWEDBYME_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case followTypes.GET_FOLLOWEDBYME_SUCCESS:
      return {
        ...state,
        requesting: false,
        following: action.info.following,
        id: action.info.id,
      };
    case followTypes.GET_FOLLOWEDBYME_FAILURE:
      return {
        ...state,
        requesting: false,
        following: '',
        id: '',
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}