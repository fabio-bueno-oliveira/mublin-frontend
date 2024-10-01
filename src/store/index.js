// import { createStore, applyMiddleware } from 'redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk'
import {thunk} from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

// const reducer = combineReducers(reducers)
// applyMiddleware supercharges createStore with middleware:
// const Store = createStore(reducer, applyMiddleware(thunk,loggerMiddleware))

export const Store = createStore(
    rootReducer,
    applyMiddleware(
        thunk,
        loggerMiddleware
    )
);