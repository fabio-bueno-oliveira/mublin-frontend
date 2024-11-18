import { searchTypes } from '../types/search';

const initialState = {
  requesting: false,
  success: false,
  error: '',
  results: [
    {
      id: '', 
      title: '', 
      type: '', 
      description: '', 
      username: '', 
      image: '', 
      foundation_year: '', 
      end_year: ''
    }
  ],
  value: ''
}

export function searchProject(state = initialState, action) {
  switch (action.type) {
    case searchTypes.GET_SEARCHPROJECT_RESULTS_REQUEST:
      return {
        ...state,
        success: false,
        requesting: true,
        results: initialState.results
      };
    case searchTypes.GET_SEARCHPROJECT_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.results,
        requesting: false,
        success: true,
        error: '',
        value: '',
      };
    case searchTypes.GET_SEARCHPROJECT_RESULTS_FAILURE:
      return {
        state: state,
        requesting: false,
        success: false,
        error: 'Nenhum projeto encontrado',
        results: initialState.results
      };
    default:
      return state
  }
}