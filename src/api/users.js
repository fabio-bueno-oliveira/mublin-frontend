import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const BASE_URL = 'https://mublin.herokuapp.com';

export function authHeader() {
    let token = localStorage.getItem('token');

    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
};

export const userService = {
    getInfo,
    getUserGenresInfoById,
    getUserRolesInfoById,
    getUserGearInfoById,
    getUserAvailabilityItemsById,
    getUserProjects,
    getUserProjectsBasicInfo,
    getUserMessages,
    getUserLastConnectedFriends,
    update,
    logout
};

async function getInfo() {
  const requestOptions = {
      method: 'GET',
      headers: authHeader()
  };

  return fetch(`${BASE_URL}/userinfo`, requestOptions).then(handleResponse);
}

async function getUserGenresInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/userInfo/${id}/genres`, requestOptions).then(handleResponse);
}

async function getUserRolesInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/userInfo/${id}/roles`, requestOptions).then(handleResponse);
}

async function getUserGearInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}/gear`, requestOptions).then(handleResponse);
}

async function getUserAvailabilityItemsById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/userInfo/${id}/availabilityItems`, requestOptions).then(handleResponse);
}

async function getUserProjects(id,type) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}/projects?type=${type}`, requestOptions).then(handleResponse);
}

async function getUserProjectsBasicInfo(id,type) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}/projectsBasicInfos`, requestOptions).then(handleResponse);
}

async function getUserLastConnectedFriends() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/lastConnectedFriends`, requestOptions).then(handleResponse);
}

async function getUserMessages() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/messages/conversations`, requestOptions).then(handleResponse);
}

async function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${BASE_URL}/users/${user.id}`, requestOptions).then(handleResponse);;
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
                // location.reload(true);
                // window.reload(true)
                // window.location.href = window.location.href;
                history.push('/');
                window.location.href = window.location.href;
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}