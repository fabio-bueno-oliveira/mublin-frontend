const BASE_URL = "https://mublin.herokuapp.com";

export function authHeader() {
  let token = localStorage.getItem('token');

  if (token) {
      return { 'Authorization': 'Bearer ' + token };
  } else {
      return {};
  }
};

export const userService = {
  login,
  logout,
  register,
  update,
  delete: _delete
};

async function login(email, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  };

  return fetch(`${BASE_URL}/login`, requestOptions)
    .then(handleResponse)
    .then(user => {
      let userLoginInfo = { firstAccess: user.firstAccess, message: user.message, success: user.success };
      localStorage.setItem('loginInfo', JSON.stringify(userLoginInfo));
      localStorage.setItem('token', user.token);
      localStorage.setItem('userInfo', JSON.stringify(user.userInfo));
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('token');
  localStorage.removeItem('loginInfo');
  localStorage.removeItem('userInfo');
}

function register(user) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${BASE_URL}/users/register`, requestOptions).then(handleResponse);
}

async function update(user) {
  const requestOptions = {
    method: 'PUT',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  };

  return fetch(`${BASE_URL}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
async function _delete(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  };

  return fetch(`${BASE_URL}/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        // history.push('/login');
        // window.location.href = window.location.href;
        // location.reload(true);
        // window.reload(true)
        // window.location.href = window.location.href;
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}