import { musicGenresTypes } from '../types/musicGenres';

const initialState = {
  requesting: false,
  success: false,
  list: [
    { id: '', name: '' }
  ],
  categories: [
    { id: '', name_ptbr: '', name: '' }
  ]
}

export function musicGenres(state = initialState, action) {
  switch (action.type) {
    case musicGenresTypes.GET_MUSIC_GENRES_REQUEST:
      return {
        ...state,
        success: false,
        requesting: true
      };
    case musicGenresTypes.GET_MUSIC_GENRES_SUCCESS:
      return {
        ...state,
        list: action.list,
        success: true,
        requesting: false,
      };
    case musicGenresTypes.GET_MUSIC_GENRES_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou"
      };
      case musicGenresTypes.GET_MUSIC_GENRESCATEGORIES_REQUEST:
      return {
        ...state,
        success: false,
        requesting: true
      };
    case musicGenresTypes.GET_MUSIC_GENRESCATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.list,
        success: true,
        requesting: false,
      };
    case musicGenresTypes.GET_MUSIC_GENRESCATEGORIES_FAILURE:
      return {
        ...state,
        requesting: false,
        success: false,
        error: "A solicitação falhou",
        categories: [
          { id: '', name_ptbr: '', name: '' }
        ]
      };
    default:
      return state
  }
}