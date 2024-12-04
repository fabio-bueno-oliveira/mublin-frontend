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

export const userService = {
    getInfo,
    getInfoById,
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

function getInfo() {
  const requestOptions = {
      method: 'GET',
      headers: authHeader()
  };

  return fetch(`${BASE_URL}/userinfo`, requestOptions).then(handleResponse);
}

function getInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}`, requestOptions).then(handleResponse);
}

function getUserGenresInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/userInfo/${id}/genres`, requestOptions).then(handleResponse);
}

function getUserRolesInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/userInfo/${id}/roles`, requestOptions).then(handleResponse);
}

function getUserGearInfoById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}/gear`, requestOptions).then(handleResponse);
}

function getUserAvailabilityItemsById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/userInfo/${id}/availabilityItems`, requestOptions).then(handleResponse);
}

function getUserProjects(id,type) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}/projects?type=${type}`, requestOptions).then(handleResponse);
}

function getUserProjectsBasicInfo(id,type) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/user/${id}/projectsBasicInfos`, requestOptions).then(handleResponse);
}

function getUserLastConnectedFriends() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/lastConnectedFriends`, requestOptions).then(handleResponse);
}

function getUserMessages() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${BASE_URL}/messages/conversations`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${BASE_URL}/users/${user.id}`, requestOptions).then(handleResponse);;
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