import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { RespositoryResponseData } from '../models';
import { fetchRepositories, initialState } from '../slice';
import { RootState, ServiceLocator, ThunkAPI } from 'root-types';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { NetworkServiceImplementation } from 'services/network-service';
import { store as reduxStore } from '@/store';

const mockAxios = axios.create();
const serviceLocator: ServiceLocator = {
  networkService: new NetworkServiceImplementation(mockAxios),
};

describe('Repositories thunk', () => {
  let api: jest.Mocked<MockAdapter>;
  let store: jest.Mocked<typeof reduxStore>;

  beforeAll(() => {
    api = new MockAdapter(mockAxios) as any;
    store = store as any;
  });

  describe('fetch repositories', () => {
    let action: AsyncThunkAction<RespositoryResponseData[], string, ThunkAPI>;
    let dispatch: any;
    const mockState: RootState = {
      organization: { ...initialState, etag: 'etag' },
    };

    let getState: () => RootState;

    let arg: string;
    let resultData: RespositoryResponseData[];
    ('facebook');

    beforeEach(() => {
      dispatch = jest.fn();
      getState = () => mockState;

      arg = 'facebook';

      api.reset();
      api.onGet(`orgs/${arg}/repos`).reply(
        200,
        {
          data: resultData,
        },
        { etag: 'new_etag' },
      );

      resultData = [
        {
          id: 0,
          name: 'Repo name',
          description: 'This is a description of the repo.',
          open_issues_count: 1,
        },
      ];

      action = fetchRepositories(arg);
    });

    it('calls the api correctly', async () => {
      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(1);
      expect(api.history.get[0].url).toBe(`orgs/${arg}/repos`);
    });

    it('dispatches successfully', async () => {
      const expectedActions = [
        {
          type: 'organization/fetchRepositories/pending',
        },
        { type: 'organization/setOrganizationName', payload: 'facebook' },
        { type: 'organization/setEtag', payload: 'new_etag' },
        {
          type: 'organization/fetchRepositories/fulfilled',
          payload: { data: resultData },
        },
      ];

      await action(dispatch, getState, serviceLocator);

      expect(dispatch.mock.calls.length).toBe(4);
      expect(dispatch.mock.calls[0][0]).toEqual(
        expect.objectContaining(expectedActions[0]),
      );
      expect(dispatch.mock.calls[1][0]).toEqual(
        expect.objectContaining(expectedActions[1]),
      );
      expect(dispatch.mock.calls[2][0]).toEqual(
        expect.objectContaining(expectedActions[2]),
      );
      expect(dispatch.mock.calls[3][0]).toEqual(
        expect.objectContaining(expectedActions[3]),
      );
    });
  });
});
