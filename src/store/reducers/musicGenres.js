import { musicGenresTypes } from '../types/musicGenres';

const initialState = {
  requesting: false,
  list: [
    { id: '', name: '' }
  ]
}

export function musicGenres(state = initialState, action) {
  switch (action.type) {
    case musicGenresTypes.GET_MUSIC_GENRES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case musicGenresTypes.GET_MUSIC_GENRES_SUCCESS:
      return {
        ...state,
        list: action.list,
        requesting: false,
      };
    case musicGenresTypes.GET_MUSIC_GENRES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}