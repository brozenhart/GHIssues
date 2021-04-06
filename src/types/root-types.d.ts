declare module 'root-types' {
  export type RootState = ReturnType<
    typeof import('../store/root-reducer').rootReducer
  >;

  export type ServiceLocator = {
    networkService: import('../services/network-service').NetworkService;
  };

  export type AppDispatch = typeof import('../store').store.dispatch;

  export type ThunkAPI = {
    dispatch: AppDispatch;
    state: RootState;
    extra: ServiceLocator;
  };
}
