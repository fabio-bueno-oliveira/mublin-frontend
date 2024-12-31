import { authenticationTypes } from '../types/authentication';
import { userService } from '../../api/authentication';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const userActions = {
    login,
    logout,
    register,
    delete: _delete
};

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => { 
                    dispatch(success(user));
                    switch (user.firstAccess) {
                        case 0:
                            history.push('/home');
                            window.location.href = window.location.href;
                            break;
                        case 1:
                            history.push('/start/intro/');
                            window.location.href = window.location.href;
                            break;
                        case 2:
                            history.push('/start/step2/');
                            window.location.href = window.location.href;
                            break;
                        case 3:
                            history.push('/start/step3/');
                            window.location.href = window.location.href;
                            break;
                        case 4:
                            history.push('/start/step4/');
                            window.location.href = window.location.href;
                            break;
                        default:
                            console.log(`Ocorreu um erro ao identificar o primeiro acesso do usuário`);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: authenticationTypes.LOGIN_REQUEST, user } }
    function success(user) { return { type: authenticationTypes.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: authenticationTypes.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: authenticationTypes.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: authenticationTypes.REGISTER_REQUEST, user } }
    function success(user) { return { type: authenticationTypes.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: authenticationTypes.REGISTER_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: authenticationTypes.DELETE_REQUEST, id } }
    function success(id) { return { type: authenticationTypes.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: authenticationTypes.DELETE_FAILURE, id, error } }
}