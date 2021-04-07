import { createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from 'root-types';
import { IssuesResponseData } from './models';

export const issuesAdapter = createEntityAdapter<IssuesResponseData>({
  selectId: data => data.id,
});

export const issuesSelectors = issuesAdapter.getSelectors<RootState>(
  state => state.issuesSearch,
);
