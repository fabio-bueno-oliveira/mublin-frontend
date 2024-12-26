import { musicGenresTypes } from '../types/musicGenres';
import { rolesTypes } from '../types/roles';
import { feedTypes } from '../types/feed';
import { gearTypes } from '../types/gear';
import { miscService } from '../../api/misc';

export const miscInfos = {
  getFeed: getFeed,
  getFeedLikes: getFeedLikes,
  getItemLikes: getItemLikes,
  getMusicGenres: getMusicGenres,
  getMusicGenresCategories: getMusicGenresCategories,
  getRoles: getRoles,
  getGearBrands: getGearBrands,
  // getNotifications: getNotifications,
  // getAvailabilityStatuses: getAvailabilityStatuses,
  // getAvailabilityItems: getAvailabilityItems,
  // getAvailabilityFocuses: getAvailabilityFocuses
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

function getFeedLikes() {
  return dispatch => {
    dispatch(request());

    miscService.getFeedLikes()
      .then(
        likes => dispatch(success(likes)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: feedTypes.GET_USER_FEED_LIKES_REQUEST} }
  function success(likes) { return { type: feedTypes.GET_USER_FEED_LIKES_SUCCESS, likes } }
  function failure(error) { return { type: feedTypes.GET_USER_FEED_LIKES_FAILURE, error } }
}

function getItemLikes(feedId) {
  return dispatch => {
    dispatch(request());

    miscService.getItemLikes(feedId)
      .then(
        result => dispatch(success(result)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request() { return { type: feedTypes.GET_ITEM_LIKES_REQUEST} }
  function success(result) { return { type: feedTypes.GET_ITEM_LIKES_SUCCESS, result } }
  function failure(error) { return { type: feedTypes.GET_ITEM_LIKES_FAILURE, error } }
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

function getGearBrands() {
  return dispatch => {
      dispatch(request());

      miscService.getAllGearBrands()
          .then(
              list => dispatch(success(list)),
              error => dispatch(failure(error.toString()))
          );
      };

  function request() { return { type: gearTypes.GET_GEAR_BRANDS_REQUEST} }
  function success(list) { return { type: gearTypes.GET_GEAR_BRANDS_SUCCESS, list } }
  function failure(error) { return { type: gearTypes.GET_GEAR_BRANDS_FAILURE, error } }
}
