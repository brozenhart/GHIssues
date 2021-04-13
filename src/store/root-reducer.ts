import { bookmarksReducer } from '@/modules/bookmarks/slice';
import { issuesSearchReducer } from '@/modules/issues-search';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  issuesSearch: issuesSearchReducer,
  bookmarks: bookmarksReducer,
});
