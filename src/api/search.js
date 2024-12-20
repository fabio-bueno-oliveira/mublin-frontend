import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const BASE_URL = "https://mublin.herokuapp.com";

export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export const searchService = {
    getUserLastSearches,
    getSearchUsersResults,
    getSearchProjectsResults,
    getSearchResults,
    getSearchProjectResults,
    getSuggestedUsersResults,
    getSuggestedFeaturedUsers,
    getSuggestedNewUsers,
    logout
};

function getUserLastSearches() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/queries/userLastSearches`, requestOptions).then(handleResponse);
}

function getSearchUsersResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/users/${query}`, requestOptions).then(handleResponse);
}

function getSearchProjectsResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/projects/${query}`, requestOptions).then(handleResponse);
}

function getSearchResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/${query}`, requestOptions).then(handleResponse);
}

function getSearchProjectResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/quickSearch/project/${query}`, requestOptions).then(handleResponse);
}

function getSuggestedUsersResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/suggestedUsers`, requestOptions).then(handleResponse);
}

function getSuggestedFeaturedUsers(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/featuredUsers`, requestOptions).then(handleResponse);
}

function getSuggestedNewUsers(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/newUsers`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                history.push('/');
                window.location.href = window.location.href;
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}