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

export const profileService = {
    getProfileInfo,
    getProfileProjects,
    getProfileRoles,
    getProfileGenres,
    getProfileFollowers,
    getProfileFollowing,
    checkProfileFollowing,
    getProfilePosts,
    getProfileGear,
    getProfileGearSetups,
    getProfilePartners,
    getProfileAvailabilityItems,
    getProfileStrengths,
    getProfileStrengthsTotalVotes,
    getProfileStrengthsRaw,
    getProfileTestimonials,
    logout
};

function getProfileInfo(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}`, requestOptions).then(handleResponse);
}

function getProfileProjects(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/projects`, requestOptions).then(handleResponse);
}

function getProfileRoles(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/roles`, requestOptions).then(handleResponse);
}

function getProfileGenres(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/genres`, requestOptions).then(handleResponse);
}

function getProfileFollowers(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/followers`, requestOptions).then(handleResponse);
}

function getProfileFollowing(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/following`, requestOptions).then(handleResponse);
}

function checkProfileFollowing(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/checkFollow`, requestOptions).then(handleResponse);
}

function getProfilePosts(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/posts`, requestOptions).then(handleResponse);
}

function getProfileGear(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/gear`, requestOptions).then(handleResponse);
}

function getProfileGearSetups(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/gearSetups`, requestOptions).then(handleResponse);
}

function getProfilePartners(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/partners`, requestOptions).then(handleResponse);
}

function getProfileAvailabilityItems(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/availabilityItems`, requestOptions).then(handleResponse);
}

function getProfileStrengths(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengths`, requestOptions).then(handleResponse);
}

function getProfileStrengthsTotalVotes(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengthsTotalVotes`, requestOptions).then(handleResponse);
}

function getProfileStrengthsRaw(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengthsRaw`, requestOptions).then(handleResponse);
}

function getProfileTestimonials(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/testimonials`, requestOptions).then(handleResponse);
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