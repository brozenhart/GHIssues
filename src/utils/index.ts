import { SerializedError } from '@reduxjs/toolkit';
import { Buffer } from 'buffer';
import { Locale } from 'config/locale';
import { Alert } from 'react-native';
import { AuthorizationHeaders } from 'services/network-service';

export const createAuthHeaders = (
  username: string,
  password: string,
): AuthorizationHeaders => ({
  Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
    'base64',
  )}`,
});

export const showToast = (
  error: SerializedError,
  onPress: () => void,
): void => {
  Alert.alert(
    error.name || Locale.DEFAULT_ERROR_TITLE,
    error.message || Locale.DEFAULT_ERROR_MESSAGE,
    [{ text: 'OK', onPress }],
  );
};

export type Field = {
  name: string;
  value?: string;
};

export const validateRequiredFields = (values: Field[]): Promise<void> =>
  new Promise((resolve, reject) => {
    if (values.length === 0) resolve();
    values.map(field => {
      if (field.value === undefined)
        reject(new Error(`${field.name} is missing.`));
    });
    resolve();
  });
