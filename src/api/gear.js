import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const BASE_URL = "https://mublin.herokuapp.com";

export function authHeader() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

export const gearService = {
    getBrandInfo,
    gerBrandProducts,
    getProductInfo,
    getProductOwners,
    logout
};

function getBrandInfo(brandUrlName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/brand/${brandUrlName}`, requestOptions).then(handleResponse);
}

function gerBrandProducts(brandUrlName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/${brandUrlName}/products`, requestOptions).then(handleResponse);
}

function getProductInfo(productId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/product/${productId}/productInfo`, requestOptions).then(handleResponse);
}

function getProductOwners(productId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/product/${productId}/productOwners`, requestOptions).then(handleResponse);
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