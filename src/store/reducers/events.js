import { eventsTypes } from '../types/events';

const initialState = {
  requesting: false,
  total: 0,
  success: false,
  result: [
    { 
      invitationId: '',
      response: '',
      eventId: '',
      authorName: '',
      authorPicture: '',
      authorUsername: '',
      title: '',
      description: '',
      method: '',
      eventDateStart: '',
      eventDateEnd: '',
      eventHourStart: '',
      eventHourEnd: '',
      authorComments: '',
      eventPicture: '',
      city: '',
      region: '',
      projectUsername: '',
      projectName: '',
      projectPicture: '',
      projectType: '',
      eventType: '',
      placeId: '',
      placeName: '',
    }
  ]
}

export function events(state = initialState, action) {
  switch (action.type) {
    case eventsTypes.GET_USERS_EVENTS_REQUEST:
      return {
        ...state,
        total: initialState.total,
        result: initialState.result,
        success: false,
        requesting: true,
        error: ''
      };
    case eventsTypes.GET_USERS_EVENTS_SUCCESS:
      return {
        ...state,
        total: action.list.total,
        result: action.list.result,
        success: true,
        requesting: false,
        error: ''
      };
    case eventsTypes.GET_USERS_EVENTS_FAILURE:
      return {
        ...state,
        total: initialState.total,
        result: initialState.result,
        success: false,
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}