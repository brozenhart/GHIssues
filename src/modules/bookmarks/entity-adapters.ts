import { createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from 'root-types';
import { Bookmarks } from './types';

export const bookmarksAdapter = createEntityAdapter<Bookmarks>({
  selectId: data => data.id,
});

export const bookmarksSelectors = bookmarksAdapter.getSelectors<RootState>(
  state => state.bookmarks,
);
