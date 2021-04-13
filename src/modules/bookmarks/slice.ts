import {
  createAsyncThunk,
  createSlice,
  EntityId,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ThunkAPI } from 'root-types';
import { IssuesResponseData } from '../issues-search';
import { bookmarksAdapter, bookmarksSelectors } from './entity-adapters';
import { BookmarksState } from './types';

export const initialState: BookmarksState = bookmarksAdapter.getInitialState();

export const ActionTypes = {
  TOGGLE_BOOKMARK: 'bookmarks/toggleBookmark',
};

export type ToggleBookmarkThunkArguments = {
  issue: IssuesResponseData;
};

export const toggleBookmark = createAsyncThunk<
  void,
  ToggleBookmarkThunkArguments,
  ThunkAPI
>(ActionTypes.TOGGLE_BOOKMARK, ({ issue }, { dispatch, getState }) => {
  const state = getState();
  const isBookmarked =
    bookmarksSelectors.selectById(state, issue.id) !== undefined;

  if (isBookmarked) dispatch(removeIssueBookmark(issue.id));
  else dispatch(setIssueBookmark(issue));
});

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setIssueBookmark: (state, action: PayloadAction<IssuesResponseData>) => {
      bookmarksAdapter.addOne(state, action.payload);
    },
    removeIssueBookmark: (state, action: PayloadAction<EntityId>) => {
      bookmarksAdapter.removeOne(state, action.payload);
    },
  },
});

export const { setIssueBookmark, removeIssueBookmark } = bookmarksSlice.actions;

export const bookmarksReducer = bookmarksSlice.reducer;
