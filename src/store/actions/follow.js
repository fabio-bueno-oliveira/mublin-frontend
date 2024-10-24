import { followTypes } from '../types/follow';
import { profileService } from '../../api/profile';

export const followInfos = {
    checkProfileFollowing: checkProfileFollowing
};

function checkProfileFollowing(username) {
    return dispatch => {
        dispatch(request(username));

        profileService.checkProfileFollowing(username)
            .then(
                info => dispatch(success(info)),
                error => dispatch(failure(username, error.toString()))
            );
    };
  
    function request(username) { return { type: followTypes.GET_FOLLOWEDBYME_REQUEST, username } }
    function success(info) { return { type: followTypes.GET_FOLLOWEDBYME_SUCCESS, info } }
    function failure(username, error) { return { type: followTypes.GET_FOLLOWEDBYME_FAILURE, username, error } }
}