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

export const projectService = {
    getProjectInfo,
    getProjectAdminAccessInfo,
    getProjectMembers,
    getProjectMembersByProjectId,
    getProjectOpportunities,
    getProjectNotes,
    getProjectEvents,
    getProjectRelatedProjects,
    getUserMainProjects,
    getUserPortfolioProjects,
    getUserProjects,
    logout
};

function getProjectInfo(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/${username}`, requestOptions).then(handleResponse);
}

function getProjectAdminAccessInfo(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/user/${username}/admin`, requestOptions).then(handleResponse);
}

function getProjectMembers(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/${username}/members`, requestOptions).then(handleResponse);
}

function getProjectMembersByProjectId(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/id/${id}/members`, requestOptions).then(handleResponse);
}

function getProjectOpportunities(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/${username}/opportunities`, requestOptions).then(handleResponse);
}

function getProjectNotes(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/${username}/notes`, requestOptions).then(handleResponse);
}

function getProjectEvents(username) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/${username}/events`, requestOptions).then(handleResponse);
}

function getProjectRelatedProjects(username,projectId,projectCity,projectMainGenre) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/project/${username}/${projectId}/${projectCity}/${projectMainGenre}/relatedProjects`, requestOptions).then(handleResponse);
}

function getUserMainProjects(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/secure/projects/user/${id}/main`, requestOptions).then(handleResponse);
}

function getUserPortfolioProjects(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/secure/projects/user/${id}/portfolio`, requestOptions).then(handleResponse);
}

function getUserProjects(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/projects/user/${id}`, requestOptions).then(handleResponse);
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