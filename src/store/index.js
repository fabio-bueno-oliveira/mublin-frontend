import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
    // const loggerMiddleware = createLogger();
    // middleware.push(loggerMiddleware);
}

export const Store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);