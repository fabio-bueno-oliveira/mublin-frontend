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

export const eventService = {
    getEventInfo,
    getUserEvents,
    logout
};

async function getEventInfo(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/event/${id}`, requestOptions).then(handleResponse);
}

async function getUserEvents(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/user/${id}/events`, requestOptions).then(handleResponse);
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