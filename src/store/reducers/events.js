import { eventsTypes } from '../types/events';

const initialState = {
  requesting: false,
  list: [
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
        requesting: true
      };
    case eventsTypes.GET_USERS_EVENTS_SUCCESS:
      return {
        ...state,
        list: action.list,
        requesting: false,
      };
    case eventsTypes.GET_USERS_EVENTS_FAILURE:
      return {
        ...state,
        list: [
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
        ],
        requesting: false,
        error: "A solicitação falhou"
      };
    default:
      return state
  }
}