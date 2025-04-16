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

export const profileService = {
    getProfileInfo,
    getProfileProjects,
    getProfileRoles,
    getProfileGenres,
    getProfileFollowers,
    getProfileFollowing,
    checkProfileFollowing,
    getProfileRelatedUsers,
    getProfilePosts,
    getProfileGear,
    getProfileGearSetups,
    getProfileGearSetup,
    getProfileGearSetupItems,
    getProfilePartners,
    getProfileAvailabilityItems,
    getProfileStrengths,
    getProfileStrengthsTotalVotes,
    getProfileStrengthsRaw,
    getProfileStrengthsVotesHistory,
    getProfileTestimonials,
    logout
};

async function getProfileInfo(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}`, requestOptions).then(handleResponse);
}

async function getProfileProjects(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/projects`, requestOptions).then(handleResponse);
}

async function getProfileRoles(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/roles`, requestOptions).then(handleResponse);
}

async function getProfileGenres(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/genres`, requestOptions).then(handleResponse);
}

async function getProfileFollowers(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/followers`, requestOptions).then(handleResponse);
}

async function getProfileFollowing(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/following`, requestOptions).then(handleResponse);
}

async function getProfileRelatedUsers(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/relatedUsers`, requestOptions).then(handleResponse);
}

async function checkProfileFollowing(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/checkFollow`, requestOptions).then(handleResponse);
}

async function getProfilePosts(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/posts`, requestOptions).then(handleResponse);
}

async function getProfileGear(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/gear`, requestOptions).then(handleResponse);
}

async function getProfileGearSetups(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/gearSetups`, requestOptions).then(handleResponse);
}

async function getProfileGearSetup(username, setupId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/gearSetup/${setupId}`, requestOptions).then(handleResponse);
}

async function getProfileGearSetupItems(username, setupId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/${setupId}/gearSetupProducts`, requestOptions).then(handleResponse);
}

async function getProfilePartners(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/partners`, requestOptions).then(handleResponse);
}

async function getProfileAvailabilityItems(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/availabilityItems`, requestOptions).then(handleResponse);
}

async function getProfileStrengths(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengths`, requestOptions).then(handleResponse);
}

async function getProfileStrengthsTotalVotes(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengthsTotalVotes`, requestOptions).then(handleResponse);
}

async function getProfileStrengthsRaw(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengthsRaw`, requestOptions).then(handleResponse);
}

async function getProfileStrengthsVotesHistory(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/strengthsRecentVotes`, requestOptions).then(handleResponse);
}

async function getProfileTestimonials(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/profile/${username}/testimonials`, requestOptions).then(handleResponse);
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