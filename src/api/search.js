import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const BASE_URL = "https://mublin.herokuapp.com";

export function authHeader() {
  let token = localStorage.getItem('token');

  if (token) {
      return { 'Authorization': 'Bearer ' + token };
  } else {
      return {};
  }
};

export const searchService = {
    getUserLastSearches,
    getSearchUsersResults,
    getSearchProjectsResults,
    getSearchResults,
    getSearchProjectResults,
    getSearchGearResults,
    getSearchBrandsResults,
    getSuggestedUsersResults,
    getSuggestedFeaturedUsers,
    getSuggestedNewUsers,
    getFeaturedProjects,
    getFeaturedProducts,
    logout
};

async function getUserLastSearches() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/queries/userLastSearches`, requestOptions).then(handleResponse);
}

async function getSearchUsersResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/users/${query}`, requestOptions).then(handleResponse);
}

async function getSearchProjectsResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/projects/${query}`, requestOptions).then(handleResponse);
}

async function getSearchResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/${query}`, requestOptions).then(handleResponse);
}

async function getSearchProjectResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/quickSearch/project/${query}`, requestOptions).then(handleResponse);
}

async function getSearchGearResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/gear/${query}`, requestOptions).then(handleResponse);
}

async function getSearchBrandsResults(query) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/brands/${query}`, requestOptions).then(handleResponse);
}

async function getSuggestedUsersResults() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/suggestedUsers`, requestOptions).then(handleResponse);
}

async function getSuggestedFeaturedUsers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/featuredUsers`, requestOptions).then(handleResponse);
}

async function getSuggestedNewUsers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/newUsers`, requestOptions).then(handleResponse);
}

async function getFeaturedProjects() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/featuredProjects`, requestOptions).then(handleResponse);
}

async function getFeaturedProducts() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/search/explore/featuredProducts`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('loginInfo');
    localStorage.removeItem('userInfo');
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