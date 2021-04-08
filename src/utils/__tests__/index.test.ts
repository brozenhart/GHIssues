import { SerializedError } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import {
  createAuthHeaders,
  Field,
  showToast,
  validateRequiredFields,
} from '../index';

jest.spyOn(Alert, 'alert');

describe('utility functions', () => {
  describe('show toast', () => {
    it('shows an alert', () => {
      const error: SerializedError = {
        name: 'Error',
        message: 'Error messsage',
      };
      const onpress = () => {
        return;
      };

      showToast(error, onpress);

      expect(Alert.alert).toHaveBeenCalled();
    });

    it('shows an alert with default error', () => {
      const error: SerializedError = {};
      const onpress = () => {
        return;
      };

      showToast(error, onpress);

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('create authorization headers', () => {
    const expected = { Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=' };

    const username = 'username';
    const password = 'password';
    const headers = createAuthHeaders(username, password);

    expect(headers).toEqual(expected);
  });

  describe('validate required field', () => {
    it('resolves when no fields are provided', async () => {
      const promise = validateRequiredFields([]);

      await expect(promise).resolves.toBeUndefined();
    });

    it('resolves when field value is defined', async () => {
      const validField: Field = { name: 'validField', value: 'aValue' };

      const promise = validateRequiredFields([validField]);

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects with error when field value is undefined', async () => {
      const invalidField: Field = { name: 'invalidField', value: undefined };

      const promise = validateRequiredFields([invalidField]);

      await expect(promise).rejects.toThrowError(
        Error('invalidField is missing.'),
      );
    });
  });
});
