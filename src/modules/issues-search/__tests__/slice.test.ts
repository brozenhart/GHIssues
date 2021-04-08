import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { IssuesResponseData } from '../models';
import {
  fetchIssues,
  initialState,
  issuesSearchReducer,
  resetError,
  resetIssues,
  setIssuesFilter,
  setIssuesSort,
  setLastPageReached,
  setNextPage,
  setOrganization,
  setRepository,
  setSelectedIssue,
  showIssueDetails,
} from '../slice';
import { RootState, ServiceLocator, ThunkAPI } from 'root-types';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { NetworkServiceImplementation } from 'services/network-service';
import {
  DefaultThunkArguments,
  IssuesSearchState,
  ShowIssueDetailsThunkArguments,
} from '../types';
import '../entity-adapters';

const mockAxios = axios.create();
const serviceLocator: ServiceLocator = {
  networkService: new NetworkServiceImplementation(mockAxios),
};

const fakeIssue: IssuesResponseData = {
  id: 0,
  title: 'Issue title',
  body: 'Issue body',
  state: 'open',
};
const mockInitialState = initialState;
jest.mock('../entity-adapters', () => {
  return {
    issuesAdapter: {
      getInitialState: jest.fn(() => ({ ...mockInitialState })),
    },
    issuesSelectors: {
      selectById: jest.fn(() => fakeIssue),
    },
  };
});

describe('issues-search thunks', () => {
  let api: jest.Mocked<MockAdapter>;
  let navigationMock: any;

  beforeAll(() => {
    api = new MockAdapter(mockAxios) as any;
  });

  describe('fetch issues', () => {
    let action: AsyncThunkAction<
      IssuesResponseData[],
      DefaultThunkArguments,
      ThunkAPI
    >;
    let dispatch: any;
    let mockState: RootState = {
      issuesSearch: initialState,
    };

    let getState: () => RootState;

    let arg: DefaultThunkArguments;
    let resultData: IssuesResponseData[];

    beforeEach(() => {
      dispatch = jest.fn();
      navigationMock = { navigate: jest.fn() };

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
      api.onGet(`repos/facebook/react/issues`).reply(200, [resultData]);

      action = fetchIssues(arg);
    });

    it('calls the api correctly', async () => {
      mockState = {
        issuesSearch: {
          ...mockState.issuesSearch,
          organization: 'facebook',
          repository: 'react',
        },
      };
      getState = () => mockState;

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(1);
      expect(api.history.get[0].url).toBe(`repos/facebook/react/issues`);
    });

    it('dispatches correctly on successful fetch', async () => {
      const expectedActions = [
        {
          type: 'issues-search/fetchIssues/pending',
        },
        {
          type: 'issues-search/fetchIssues/fulfilled',
          payload: [resultData],
        },
      ];

      const call = await action(dispatch, getState, serviceLocator);

      expect.assertions(4);
      expect(dispatch).toHaveBeenCalledWith(call);
      expect(dispatch.mock.calls.length).toBe(2);
      expect(dispatch.mock.calls[0][0]).toEqual(
        expect.objectContaining(expectedActions[0]),
      );
      expect(dispatch.mock.calls[1][0]).toEqual(
        expect.objectContaining(expectedActions[1]),
      );
    });

    it('navigates to issues screen after initial successful fetch', async () => {
      navigationMock.dangerouslyGetState = jest.fn(() => ({
        index: 0,
        routes: [{ name: 'issues-search' }],
      }));
      arg = { navigation: navigationMock };
      action = fetchIssues(arg);
      mockState = {
        issuesSearch: {
          ...mockState.issuesSearch,
          organization: 'facebook',
          repository: 'react',
          page: 1,
        },
      };
      getState = () => mockState;

      await action(dispatch, getState, serviceLocator);

      expect(navigationMock.dangerouslyGetState).toBeCalledTimes(1);
      expect(navigationMock.navigate).toBeCalledTimes(1);
      expect(navigationMock.navigate).toBeCalledWith('issues');
    });

    it('does not navigate to issues screen on when already on it', async () => {
      navigationMock.dangerouslyGetState = jest.fn(() => ({
        index: 1,
        routes: [{ name: 'issues-search' }, { name: 'issues' }],
      }));
      arg = { navigation: navigationMock };
      action = fetchIssues(arg);
      mockState = {
        issuesSearch: {
          ...mockState.issuesSearch,
          organization: 'facebook',
          repository: 'react',
          page: 1,
        },
      };
      getState = () => mockState;

      await action(dispatch, getState, serviceLocator);

      expect(navigationMock.dangerouslyGetState).toBeCalledTimes(1);
      expect(navigationMock.navigate).toBeCalledTimes(0);
    });

    it('rejects when organization and repository are missing in state', async () => {
      const expected = {
        error: { message: 'Github organization is missing.', name: 'Error' },
        type: 'issues-search/fetchIssues/rejected',
      };
      mockState = {
        issuesSearch: initialState,
      };
      getState = () => mockState;
      api.onGet(`repos///issues`).reply(404);

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(0);
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          error: expect.objectContaining(expected.error),
          type: expected.type,
        }),
      );
    });

    it('rejects when repository is missing in state', async () => {
      const expected = {
        error: { message: 'Repository is missing.', name: 'Error' },
        type: 'issues-search/fetchIssues/rejected',
      };
      mockState = {
        issuesSearch: {
          ...initialState,
          organization: 'facebook',
        },
      };
      getState = () => mockState;
      api.onGet(`repos/facebook//issues`).reply(404);

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(0);
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          error: expect.objectContaining(expected.error),
          type: expected.type,
        }),
      );
    });

    it('rejects when organization does not exist', async () => {
      const expected = {
        meta: { rejectedWithValue: true },
        type: 'issues-search/fetchIssues/rejected',
      };
      mockState = {
        issuesSearch: {
          ...initialState,
          organization: 'invalid-organization',
          repository: 'react',
        },
      };
      getState = () => mockState;
      api.onGet(`repos/invalid-organization/react/issues`).reply(404);

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(1);
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining(expected.meta),
          type: expected.type,
        }),
      );
    });

    it('rejects when repository does not exist', async () => {
      const expected = {
        meta: { rejectedWithValue: true },
        type: 'issues-search/fetchIssues/rejected',
      };
      mockState = {
        issuesSearch: {
          ...initialState,
          organization: 'facebook',
          repository: 'invalid-repository',
        },
      };
      getState = () => mockState;
      api.onGet(`repos/facebook/invalid-repository/issues`).reply(404);

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(1);
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining(expected.meta),
          type: expected.type,
        }),
      );
    });

    it('rejects when no issues are found for repository', async () => {
      const expectedActions = [
        {
          type: 'issues-search/fetchIssues/pending',
        },
        {
          type: 'issues-search/setLastPageReached',
        },
        {
          type: 'issues-search/fetchIssues/rejected',
          payload: { message: 'Repository has no issues.' },
        },
      ];
      mockState = {
        issuesSearch: {
          ...initialState,
          organization: 'facebook',
          repository: 'valid-repo-without-issues',
        },
      };
      getState = () => mockState;
      api
        .onGet(`repos/facebook/valid-repo-without-issues/issues`)
        .reply(200, []);

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(1);
      expect(dispatch).toBeCalledTimes(3);
      expect(dispatch.mock.calls[0][0]).toEqual(
        expect.objectContaining(expectedActions[0]),
      );
      expect(dispatch.mock.calls[1][0]).toEqual(
        expect.objectContaining(expectedActions[1]),
      );
      expect(dispatch.mock.calls[2][0]).toEqual(
        expect.objectContaining(expectedActions[2]),
      );
    });

    it('rejects when isLastPageReached is true', async () => {
      const expected = {
        payload: { message: 'No issues found.' },
        type: 'issues-search/fetchIssues/rejected',
      };
      mockState = {
        issuesSearch: {
          ...initialState,
          organization: 'valid-organization',
          repository: 'valid-repository',
          isLastPageReached: true,
        },
      };
      getState = () => mockState;

      await action(dispatch, getState, serviceLocator);

      expect(api.history.get.length).toBe(0);
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining(expected.payload),
          type: expected.type,
        }),
      );
    });
  });

  describe('show issue details', () => {
    let action: AsyncThunkAction<
      void,
      ShowIssueDetailsThunkArguments,
      ThunkAPI
    >;
    let dispatch: any;
    const mockState: RootState = {
      issuesSearch: initialState,
    };

    let getState: () => RootState;

    let arg: ShowIssueDetailsThunkArguments;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = () => mockState;

      arg = { navigation: navigationMock, issueId: 0 };

      action = showIssueDetails(arg);
    });

    it('stores selected issue and navigates to issue details', async () => {
      const expectedActions = [
        {
          type: 'issues-search/showIssueDetails/pending',
        },
        { type: 'issues-search/setSelectedIssue', payload: fakeIssue },
        {
          type: 'issues-search/showIssueDetails/fulfilled',
        },
      ];

      await action(dispatch, getState, serviceLocator);

      expect(dispatch).toBeCalledTimes(3);
      expect(dispatch.mock.calls[0][0]).toEqual(
        expect.objectContaining(expectedActions[0]),
      );
      expect(dispatch.mock.calls[1][0]).toEqual(
        expect.objectContaining(expectedActions[1]),
      );
      expect(dispatch.mock.calls[2][0]).toEqual(
        expect.objectContaining(expectedActions[2]),
      );
    });
  });
});

describe('issue-search actions', () => {
  it('sets organization', () => {
    const expectedState: Partial<IssuesSearchState> = {
      organization: 'facebook',
    };

    const action = setOrganization('facebook');
    const actual = issuesSearchReducer(initialState, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets repository', () => {
    const expectedState: Partial<IssuesSearchState> = {
      repository: 'react',
    };

    const action = setRepository('react');
    const actual = issuesSearchReducer(initialState, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets the next page', () => {
    const expectedState: Partial<IssuesSearchState> = {
      page: 2,
    };

    const action = setNextPage;
    const initialStateStub = { ...initialState, page: 1 };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets the last page reached flag', () => {
    const expectedState: Partial<IssuesSearchState> = {
      isLastPageReached: true,
    };

    const action = setLastPageReached;
    const initialStateStub = { ...initialState };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets the issues filter', () => {
    const expectedState: Partial<IssuesSearchState> = {
      filter: 'closed',
      isLastPageReached: false,
      page: 1,
      entities: undefined,
      ids: undefined,
      sort: 'comments',
    };

    const action = setIssuesFilter('closed');
    const initialStateStub: IssuesSearchState = {
      ...initialState,
      page: 2,
      isLastPageReached: true,
      entities: {
        0: { id: 0, title: 'title', body: 'body', state: 'open' },
      },
      ids: [0],
      sort: 'comments',
    };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets the issues sort', () => {
    const expectedState: Partial<IssuesSearchState> = {
      sort: 'comments',
      isLastPageReached: false,
      page: 1,
      entities: undefined,
      ids: undefined,
      filter: 'open',
    };

    const action = setIssuesSort('comments');
    const initialStateStub: IssuesSearchState = {
      ...initialState,
      page: 2,
      isLastPageReached: true,
      entities: {
        0: { id: 0, title: 'title', body: 'body', state: 'open' },
      },
      ids: [0],
      filter: 'open',
    };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets the selected issue', () => {
    const expectedState: Partial<IssuesSearchState> = {
      sort: 'comments',
      isLastPageReached: true,
      page: 2,
      entities: {
        0: { id: 0, title: 'Issue title', body: 'Issue body', state: 'open' },
      },
      ids: [0],
      filter: 'open',
      selectedIssue: {
        id: 0,
        title: 'Issue title',
        body: 'Issue body',
        state: 'open',
      },
    };

    const action = setSelectedIssue({
      id: 0,
      title: 'Issue title',
      body: 'Issue body',
      state: 'open',
    });
    const initialStateStub: IssuesSearchState = {
      ...initialState,
      page: 2,
      isLastPageReached: true,
      entities: {
        0: { id: 0, title: 'Issue title', body: 'Issue body', state: 'open' },
      },
      ids: [0],
      filter: 'open',
      sort: 'comments',
    };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('resets the stored issues', () => {
    const expectedState: Partial<IssuesSearchState> = {
      entities: undefined,
      ids: undefined,
      page: 1,
    };

    const action = resetIssues();
    const initialStateStub: IssuesSearchState = {
      ...initialState,
      entities: {
        0: { id: 0, title: 'Issue title', body: 'Issue body', state: 'open' },
      },
      ids: [0],
    };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('resets the stored error', () => {
    const expectedState: Partial<IssuesSearchState> = {
      error: undefined,
    };

    const action = resetError();
    const initialStateStub: IssuesSearchState = {
      ...initialState,
      error: { message: 'error' },
    };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });

  it('sets loading to true when fetchIssues is pending', () => {
    const expectedState: Partial<IssuesSearchState> = {
      isLoading: true,
    };

    const action = fetchIssues.pending;
    const initialStateStub: IssuesSearchState = {
      ...initialState,
      isLoading: false,
    };
    const actual = issuesSearchReducer(initialStateStub, action);

    expect(actual).toEqual(expectedState);
  });
});
