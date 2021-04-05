import { Constant } from '@/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export type AuthorizationHeaders = { Authorization: string };

export interface NetworkService {
  get: <T>(
    path: string,
    headers: AuthorizationHeaders,
  ) => Promise<AxiosResponse<T>>;
}

export class NetworkServiceImplementation implements NetworkService {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: Constant.API.BASE_URL,
      headers: Constant.API.DEFAULT_HEADERS,
    });
  }

  get = async <T>(
    path: string,
    headers: AuthorizationHeaders,
  ): Promise<AxiosResponse<T>> => {
    return await this.axios.get<T>(path, { headers });
  };
}
