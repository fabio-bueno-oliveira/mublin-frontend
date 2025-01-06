import { availabilityOptionsTypes } from '../types/availabilityOptions';

const initialState = {
  requesting: false,
  statuses: [
    { id: '', title: '', color: '' }
  ],
  items: [
    { id: '', name: '' }
  ],
  focuses: [
    { id: '', title: '' }
  ]
}

export function availabilityOptions(state = initialState, action) {
  switch (action.type) {
    case availabilityOptionsTypes.GET_AVAILABILITY_STATUSES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case availabilityOptionsTypes.GET_AVAILABILITY_STATUSES_SUCCESS:
      return {
        ...state,
        statuses: action.list,
        requesting: false,
      };
    case availabilityOptionsTypes.GET_AVAILABILITY_STATUSES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // ITEMS
    case availabilityOptionsTypes.GET_AVAILABILITY_ITEMS_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case availabilityOptionsTypes.GET_AVAILABILITY_ITEMS_SUCCESS:
      return {
        ...state,
        items: action.list,
        requesting: false,
      };
    case availabilityOptionsTypes.GET_AVAILABILITY_ITEMS_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    // FOCUSES
    case availabilityOptionsTypes.GET_AVAILABILITY_FOCUSES_REQUEST:
      return {
        ...state,
        requesting: true
      };
    case availabilityOptionsTypes.GET_AVAILABILITY_FOCUSES_SUCCESS:
      return {
        ...state,
        focuses: action.list,
        requesting: false,
      };
    case availabilityOptionsTypes.GET_AVAILABILITY_FOCUSES_FAILURE:
      return {
        ...state,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}