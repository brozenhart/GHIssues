import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import logger from 'redux-logger';
import { ServiceLocator, AppDispatch } from 'root-types';
import { NetworkServiceImplementation } from 'services/network-service';
import { rootReducer } from './root-reducer';

const serviceLocator: ServiceLocator = {
  networkService: new NetworkServiceImplementation(axios.create()),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: { extraArgument: serviceLocator } }).concat(
      logger,
    ),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
