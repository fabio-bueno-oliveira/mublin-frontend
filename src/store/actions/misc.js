import { musicGenresTypes } from '../types/musicGenres';
import { rolesTypes } from '../types/roles';
import { feedTypes } from '../types/feed';
import { miscService } from '../../api/misc';

export const miscInfos = {
//   getNotifications: getNotifications,
  getFeed: getFeed,
  getMusicGenres: getMusicGenres,
  getMusicGenresCategories: getMusicGenresCategories,
  getRoles: getRoles,
//   getGearBrands: getGearBrands,
//   getAvailabilityStatuses: getAvailabilityStatuses,
//   getAvailabilityItems: getAvailabilityItems,
//   getAvailabilityFocuses: getAvailabilityFocuses
};

function getFeed() {
  return dispatch => {
    dispatch(request());

    miscService.getFeed()
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: feedTypes.GET_USER_FEED_REQUEST} }
  function success(list) { return { type: feedTypes.GET_USER_FEED_SUCCESS, list } }
  function failure(error) { return { type: feedTypes.GET_USER_FEED_FAILURE, error } }
}

function getMusicGenres() {
  return dispatch => {
    dispatch(request());

    miscService.getAllMusicGenres()
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: musicGenresTypes.GET_MUSIC_GENRES_REQUEST} }
  function success(list) { return { type: musicGenresTypes.GET_MUSIC_GENRES_SUCCESS, list } }
  function failure(error) { return { type: musicGenresTypes.GET_MUSIC_GENRES_FAILURE, error } }
}

function getMusicGenresCategories() {
  return dispatch => {
    dispatch(request());

    miscService.getAllMusicGenresCategories()
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: musicGenresTypes.GET_MUSIC_GENRESCATEGORIES_REQUEST} }
  function success(list) { return { type: musicGenresTypes.GET_MUSIC_GENRESCATEGORIES_SUCCESS, list } }
  function failure(error) { return { type: musicGenresTypes.GET_MUSIC_GENRESCATEGORIES_FAILURE, error } }
}

function getRoles() {
  return dispatch => {
    dispatch(request());

    miscService.getAllRoles()
      .then(
        list => dispatch(success(list)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: rolesTypes.GET_ROLES_REQUEST} }
  function success(list) { return { type: rolesTypes.GET_ROLES_SUCCESS, list } }
  function failure(error) { return { type: rolesTypes.GET_ROLES_FAILURE, error } }
}
