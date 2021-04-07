import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { IssuesResponseData } from '../models';
import { fetchIssues, DefaultThunkArguments, initialState } from '../slice';
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
    let action: AsyncThunkAction<
      IssuesResponseData[],
      DefaultThunkArguments,
      ThunkAPI
    >;
    let dispatch: any;
    let mockState: RootState = {
      issuesSearch: {
        ...initialState,
      },
    };

    let getState: () => RootState;

    let arg: DefaultThunkArguments;
    let resultData: IssuesResponseData[];

    beforeEach(() => {
      dispatch = jest.fn();
      mockState = {
        issuesSearch: {
          ...mockState.issuesSearch,
          isLoading: false,
          organization: 'facebook',
          repository: 'react',
        },
      };
      getState = () => mockState;

      arg = {};
      resultData = [
        {
          id: 0,
          title: 'Issue title',
          body: 'This is a body of the issue.',
          state: 'open',
        },
      ];

      api.reset();
      api.onGet(`repos/facebook/react/issues`).reply(200, {
        data: resultData,
      });

      action = fetchIssues(arg);
    });

    it('calls the api correctly', async () => {
      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(1);
      expect(api.history.get[0].url).toBe(`repos/facebook/react/issues`);
    });

    it('dispatches successfully', async () => {
      const expectedActions = [
        {
          type: 'issues-search/fetchIssues/pending',
        },
        {
          type: 'issues-search/fetchIssues/fulfilled',
          payload: { data: resultData },
        },
      ];

      await action(dispatch, getState, serviceLocator);

      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0][0]).toEqual(
        expect.objectContaining(expectedActions[0]),
      );
      expect(dispatch.mock.calls[1][0]).toEqual(
        expect.objectContaining(expectedActions[1]),
      );
    });
  });
});
