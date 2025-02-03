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

export const gearService = {
    getBrandInfo,
    gerBrandProducts,
    gerBrandPartners,
    gerBrandOwners,
    getProductInfo,
    getProductOwners,
    logout
};

async function getBrandInfo(brandUrlName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/brand/${brandUrlName}`, requestOptions).then(handleResponse);
}

async function gerBrandProducts(brandUrlName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/${brandUrlName}/products`, requestOptions).then(handleResponse);
}

async function gerBrandPartners(brandUrlName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/brand/${brandUrlName}/partners`, requestOptions).then(handleResponse);
}

async function gerBrandOwners(brandUrlName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/brand/${brandUrlName}/owners`, requestOptions).then(handleResponse);
}

async function getProductInfo(productId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/product/${productId}/productInfo`, requestOptions).then(handleResponse);
}

async function getProductOwners(productId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${BASE_URL}/gear/product/${productId}/productOwners`, requestOptions).then(handleResponse);
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