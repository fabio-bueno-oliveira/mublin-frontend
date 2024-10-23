import { searchTypes } from '../types/search';
import { searchService } from '../../api/search';

export const searchInfos = {
    getSearchUsersResults: getSearchUsersResults,
    getSearchProjectsResults: getSearchProjectsResults,
    getSearchResults: getSearchResults,
    getSearchProjectResults: getSearchProjectResults,
    getSuggestedUsersResults: getSuggestedUsersResults
};

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