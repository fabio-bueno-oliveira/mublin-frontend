import { searchTypes } from '../types/search';
import { searchService } from '../../api/search';

export const searchInfos = {
  getUserLastSearches: getUserLastSearches,
  getSearchUsersResults: getSearchUsersResults,
  getSearchProjectsResults: getSearchProjectsResults,
  resetSearchProjectResults: resetSearchProjectResults,
  getSearchResults: getSearchResults,
  getSearchProjectResults: getSearchProjectResults,
  getSearchGearResults: getSearchGearResults,
  getSearchBrandsResults: getSearchBrandsResults,
  getSuggestedUsersResults: getSuggestedUsersResults,
  getSuggestedFeaturedUsers: getSuggestedFeaturedUsers,
  getSuggestedNewUsers: getSuggestedNewUsers,
  getFeaturedProjects: getFeaturedProjects,
  getFeaturedProducts: getFeaturedProducts,
  getFeaturedGenres: getFeaturedGenres,
  getProjectsByGenre: getProjectsByGenre
};

function getUserLastSearches(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getUserLastSearches(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_USERLASTSEARCHES_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_USERLASTSEARCHES_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_USERLASTSEARCHES_FAILURE, error } }
}

function getSearchUsersResults(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getSearchUsersResults(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.SEARCH_USERS_REQUEST, query } }
  function success(results) { return { type: searchTypes.SEARCH_USERS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.SEARCH_USERS_FAILURE, error } }
}

function getSearchProjectsResults(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getSearchProjectsResults(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.SEARCH_PROJECTS_REQUEST, query } }
  function success(results) { return { type: searchTypes.SEARCH_PROJECTS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.SEARCH_PROJECTS_FAILURE, error } }
}

function resetSearchProjectResults() {
  return { type: searchTypes.RESET_SEARCH_PROJECTS }
}

function getSearchResults(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getSearchResults(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_SEARCH_RESULTS_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_SEARCH_RESULTS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_SEARCH_RESULTS_FAILURE, error } }
}

function getSearchProjectResults(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getSearchProjectResults(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_SEARCHPROJECT_RESULTS_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_SEARCHPROJECT_RESULTS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_SEARCHPROJECT_RESULTS_FAILURE, error } }
}

function getSearchGearResults(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getSearchGearResults(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.SEARCH_GEAR_REQUEST, query } }
  function success(results) { return { type: searchTypes.SEARCH_GEAR_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.SEARCH_GEAR_FAILURE, error } }
}

function getSearchBrandsResults(query) {
  return dispatch => {
    dispatch(request(query));

    searchService.getSearchBrandsResults(query)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(query, error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.SEARCH_BRANDS_REQUEST, query } }
  function success(results) { return { type: searchTypes.SEARCH_BRANDS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.SEARCH_BRANDS_FAILURE, error } }
}

function getSuggestedUsersResults() {
  return dispatch => {
    dispatch(request());

    searchService.getSuggestedUsersResults()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_SUGGESTEDUSERS_REQUEST } }
  function success(results) { return { type: searchTypes.GET_SUGGESTEDUSERS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_SUGGESTEDUSERS_FAILURE, error } }
}

function getSuggestedFeaturedUsers() {
  return dispatch => {
    dispatch(request());

    searchService.getSuggestedFeaturedUsers()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_SUGGESTED_FEATURED_USERS_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_SUGGESTED_FEATURED_USERS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_SUGGESTED_FEATURED_USERS_FAILURE, error } }
}

function getSuggestedNewUsers() {
  return dispatch => {
    dispatch(request());

    searchService.getSuggestedNewUsers()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_SUGGESTED_NEW_USERS_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_SUGGESTED_NEW_USERS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_SUGGESTED_NEW_USERS_FAILURE, error } }
}

function getFeaturedProjects() {
  return dispatch => {
    dispatch(request());

    searchService.getFeaturedProjects()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_FEATURED_PROJECTS_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_FEATURED_PROJECTS_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_FEATURED_PROJECTS_FAILURE, error } }
}

function getFeaturedProducts() {
  return dispatch => {
    dispatch(request());

    searchService.getFeaturedProducts()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_FEATURED_GEAR_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_FEATURED_GEAR_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_FEATURED_GEAR_FAILURE, error } }
}

function getFeaturedGenres() {
  return dispatch => {
    dispatch(request());

    searchService.getFeaturedGenres()
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(error.toString()))
      );
    };

  function request(query) { return { type: searchTypes.GET_FEATURED_GENRES_REQUEST, query } }
  function success(results) { return { type: searchTypes.GET_FEATURED_GENRES_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.GET_FEATURED_GENRES_FAILURE, error } }
}

function getProjectsByGenre(genreId) {
  return dispatch => {
    dispatch(request(genreId));

    searchService.getProjectsByGenre(genreId)
      .then(
        results => dispatch(success(results)),
        error => dispatch(failure(genreId, error.toString()))
      );
    };

  function request(genreId) { return { type: searchTypes.SEARCH_PROJECTSBYGENRE_REQUEST, genreId } }
  function success(results) { return { type: searchTypes.SEARCH_PROJECTSBYGENRE_SUCCESS, results } }
  function failure(error) { return { type: searchTypes.SEARCH_PROJECTSBYGENRE_FAILURE, error } }
}
