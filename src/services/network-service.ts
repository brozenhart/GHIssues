import { Constant } from '@/config';
import { AxiosInstance, AxiosResponse } from 'axios';

export type AuthorizationHeaders = { Authorization: string };

export interface NetworkService {
  get: <T>(
    path: string,
    headers: AuthorizationHeaders,
  ) => Promise<AxiosResponse<T>>;
}

export class NetworkServiceImplementation implements NetworkService {
  private readonly axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    axios.defaults.baseURL = Constant.API.BASE_URL;
    axios.defaults.headers = Constant.API.DEFAULT_HEADERS;
    this.axios = axios;
  }

  get = async <T>(
    path: string,
    headers: AuthorizationHeaders,
  ): Promise<AxiosResponse<T>> => {
    return await this.axios.get<T>(path, { headers });
  };
}
