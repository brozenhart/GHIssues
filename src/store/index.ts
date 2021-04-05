import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { ServiceLocator } from 'root-types';
import { NetworkServiceImplementation } from 'services/network-service';
import { rootReducer } from './root-reducer';

const serviceLocator: ServiceLocator = {
  networkService: new NetworkServiceImplementation(),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: { extraArgument: serviceLocator } }).concat(
      logger,
    ),
});
