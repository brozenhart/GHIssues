import { EntityState } from '@reduxjs/toolkit';
import { IssuesResponseData } from '../issues-search';

export type Bookmarks = IssuesResponseData;

export type BookmarksState = EntityState<Bookmarks>;
