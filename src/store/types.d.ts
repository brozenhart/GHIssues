declare module 'root-types' {
  export type RootState = ReturnType<
    typeof import('./root-reducer').rootReducer
  >;
  export type AppDispatch = typeof store.dispatch;
  export const useAppDispatch = (): ReturnType<typeof useDispatch> =>
    useDispatch<AppDispatch>();

  export type ServiceLocator = {
    networkService: import('../services/network-service').NetworkService;
  };

  export type ThunkAPI = {
    dispatch: AppDispatch;
    state: RootState;
    extra: ServiceLocator;
  };
}
