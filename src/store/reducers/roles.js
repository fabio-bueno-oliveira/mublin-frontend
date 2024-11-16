import { rolesTypes } from '../types/roles';

const initialState = {
  requesting: false,
  list: [
    { id: '', name: '', description: '', instrumentalist: '', icon: '' }
  ]
}

export function roles(state = initialState, action) {
  switch (action.type) {
    case rolesTypes.GET_ROLES_REQUEST:
      return {
        ...state,
        requesting: true,
        list: initialState.list
      };
    case rolesTypes.GET_ROLES_SUCCESS:
      return {
        ...state,
        list: action.list,
        requesting: false,
      };
    case rolesTypes.GET_ROLES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou",
        list: initialState.list
      };
    default:
      return state
  }
}