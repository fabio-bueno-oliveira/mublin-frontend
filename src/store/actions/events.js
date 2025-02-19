import { eventsTypes } from '../types/events';
import { eventService } from '../../api/events';

export const eventsActions = {
    getUserEvents: getUserEvents
};

function getUserEvents(id) {
    return dispatch => {
        dispatch(request(id));
  
        eventService.getUserEvents(id)
            .then(
                list => dispatch(success(list)),
                error => dispatch(failure(id, error.toString()))
            );
        };
  
    function request(id) { return { type: eventsTypes.GET_USERS_EVENTS_REQUEST, id } }
    function success(list) { return { type: eventsTypes.GET_USERS_EVENTS_SUCCESS, list } }
    function failure(error) { return { type: eventsTypes.GET_USERS_EVENTS_FAILURE, error } }
}