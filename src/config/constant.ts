import { API_TOKEN } from '@env';

export const Constant = {
  API: {
    BASE_URL: 'https://api.github.com/',
    DEFAULT_HEADERS: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    AUTH_HEADER: {
      Authorization: API_TOKEN,
    },
  },
};
