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

export const miscService = {
  getNotifications,
  getFeed,
  getItemLikes,
  getAllMusicGenres,
  getAllMusicGenresCategories,
  getAllRoles,
  getAllGearBrands,
  getAvailabilityStatuses,
  getAvailabilityItems,
  getAvailabilityFocuses,
  logout
};

async function getFeed() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/feed`, requestOptions).then(handleResponse);
}

async function getItemLikes(feedId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/${feedId}/feedLikes`, requestOptions).then(handleResponse);
}

async function getNotifications() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/notifications`, requestOptions).then(handleResponse);
}

async function getAllMusicGenres() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/music/genres`, requestOptions).then(handleResponse);
}

async function getAllMusicGenresCategories() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/music/genresCategories`, requestOptions).then(handleResponse);
}

async function getAllRoles() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/music/roles`, requestOptions).then(handleResponse);
}

async function getAllGearBrands() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/gear/allBrands`, requestOptions).then(handleResponse);
}

async function getAvailabilityStatuses() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/availabilityStatuses`, requestOptions).then(handleResponse);
}

async function getAvailabilityItems() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/availabilityItems`, requestOptions).then(handleResponse);
}

async function getAvailabilityFocuses() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };
  return fetch(`${BASE_URL}/availabilityFocuses`, requestOptions).then(handleResponse);
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