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

export const miscService = {
  getNotifications,
  getFeed,
  getAllMusicGenres,
  getAllRoles,
  getAllGearBrands,
  getAvailabilityStatuses,
  getAvailabilityItems,
  getAvailabilityFocuses,
  logout
};

function getFeed() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/simpleFeed`, requestOptions).then(handleResponse);
}

function getNotifications() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/notifications`, requestOptions).then(handleResponse);
}

function getAllMusicGenres() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/music/genres`, requestOptions).then(handleResponse);
}

function getAllRoles() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/music/roles`, requestOptions).then(handleResponse);
}

function getAllGearBrands() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/gear/allBrands`, requestOptions).then(handleResponse);
}

function getAvailabilityStatuses() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/availabilityStatuses`, requestOptions).then(handleResponse);
}

function getAvailabilityItems() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/availabilityItems`, requestOptions).then(handleResponse);
}

function getAvailabilityFocuses() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/availabilityFocuses`, requestOptions).then(handleResponse);
}

function logout() {
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