import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import middleware from './middleware';
import reducer from './reducer';

const enhancers = [
    applyMiddleware(...middleware)
];

/* Enable redux dev tools only in development.
 * We suggest using the standalone React Native Debugger extension:
 * https://github.com/jhen0409/react-native-debugger
 */
const composeEnhancers = (
    __DEV__ &&
    typeof (window) !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

const enhancer = composeEnhancers(...enhancers);

const persistConfig = {
    key: 'secretCoco',
    storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(
    persistedReducer,
    {},
    enhancer
);
export const persistor = persistStore(store);
