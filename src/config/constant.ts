import { API_USERNAME, API_TOKEN } from '@env';

export const Constant = {
  API: {
    BASE_URL: 'https://api.github.com/',
    DEFAULT_HEADERS: {
      Accept: 'application/vnd.github.v3+json',
      'Content-type': 'application/json',
    },
    AUTH: {
      username: API_USERNAME,
      password: API_TOKEN,
    },
  },
} as const;
