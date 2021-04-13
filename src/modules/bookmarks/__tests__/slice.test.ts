import {
  initialState as issuesSearchInitialState,
  IssuesResponseData,
} from '@/modules/issues-search';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { RootState, ThunkAPI } from 'root-types';
import {
  bookmarksReducer,
  initialState as bookmarksInitialState,
  removeIssueBookmark,
  setIssueBookmark,
  toggleBookmark,
  ToggleBookmarkThunkArguments,
} from '../slice';
import { BookmarksState } from '../types';

describe('bookmarks thunks', () => {
  let action: AsyncThunkAction<void, ToggleBookmarkThunkArguments, ThunkAPI>;
  let dispatch: any;
  let mockState: RootState = {
    issuesSearch: issuesSearchInitialState,
    bookmarks: bookmarksInitialState,
  };
  let getState: () => RootState;
  let arg: ToggleBookmarkThunkArguments;
  const serviceLocator: any = {};

  beforeEach(() => {
    dispatch = jest.fn();

    arg = {
      issue: {
        id: 0,
        title: 'Issue title',
        body: 'Issue body',
        state: 'open',
      },
    };

    action = toggleBookmark(arg);
  });

  it('sets the issue as a bookmark when its not', async () => {
    const expectedActions = [
      {
        type: 'bookmarks/toggleBookmark/pending',
      },
      {
        payload: {
          body: 'Issue body',
          id: 0,
          state: 'open',
          title: 'Issue title',
        },
        type: 'bookmarks/setIssueBookmark',
      },
      {
        type: 'bookmarks/toggleBookmark/fulfilled',
      },
    ];

    getState = () => mockState;
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

  it('removes the issue as a bookmark when its already bookmarked', async () => {
    const expectedActions = [
      {
        type: 'bookmarks/toggleBookmark/pending',
      },
      {
        payload: 0,
        type: 'bookmarks/removeIssueBookmark',
      },
      {
        type: 'bookmarks/toggleBookmark/fulfilled',
      },
    ];

    mockState = {
      ...mockState,
      bookmarks: {
        ...mockState.bookmarks,
        entities: {
          0: { id: 0, title: 'Issue title', body: 'Issue body', state: 'open' },
        },
        ids: [0],
      },
    };
    getState = () => mockState;
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

describe('bookmarks actions', () => {
  it('sets issue as bookmark', () => {
    const expectedState: Partial<BookmarksState> = {
      entities: {
        0: { id: 0, title: 'Issue title', body: 'Issue body', state: 'open' },
      },
      ids: [0],
    };

    const issue: IssuesResponseData = {
      id: 0,
      title: 'Issue title',
      body: 'Issue body',
      state: 'open',
    };
    const action = setIssueBookmark(issue);
    const actual = bookmarksReducer(bookmarksInitialState, action);

    expect(actual).toEqual(expectedState);
  });

  it('removes issue as bookmark', () => {
    const expectedState: Partial<BookmarksState> = {
      entities: {
        1: {
          id: 1,
          title: 'Issue title 1',
          body: 'Issue body 1',
          state: 'open',
        },
        2: {
          id: 2,
          title: 'Issue title 2',
          body: 'Issue body 2',
          state: 'open',
        },
        3: {
          id: 3,
          title: 'Issue title 3',
          body: 'Issue body 3',
          state: 'open',
        },
      },
      ids: [1, 2, 3],
    };

    const initialState = {
      entities: {
        0: { id: 0, title: 'Issue title', body: 'Issue body', state: 'open' },
        1: {
          id: 1,
          title: 'Issue title 1',
          body: 'Issue body 1',
          state: 'open',
        },
        2: {
          id: 2,
          title: 'Issue title 2',
          body: 'Issue body 2',
          state: 'open',
        },
        3: {
          id: 3,
          title: 'Issue title 3',
          body: 'Issue body 3',
          state: 'open',
        },
      },
      ids: [0, 1, 2, 3],
    };
    const issueId = 0;
    const action = removeIssueBookmark(issueId);
    const actual = bookmarksReducer(initialState, action);

    expect(actual).toEqual(expectedState);
  });
});
