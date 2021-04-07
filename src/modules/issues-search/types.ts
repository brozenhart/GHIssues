import { useNavigation } from '@react-navigation/native';
import { EntityState, SerializedError } from '@reduxjs/toolkit';
import { IssuesResponseData } from './models';

export type IssuesFilter = 'all' | 'open' | 'closed';
export type IssuesSort = 'updated' | 'created' | 'comments';

export type IssuesSearchState = EntityState<IssuesResponseData> & {
  organization?: string;
  repository?: string;
  isLoading: boolean;
  error?: SerializedError;
  page: number;
  isLastPageReached: boolean;
  filter: IssuesFilter;
  sort: IssuesSort;
  selectedIssue?: IssuesResponseData;
};

export type DefaultThunkArguments = {
  navigation?: ReturnType<typeof useNavigation>;
};

export type ShowIssueDetailsThunkArguments = Required<DefaultThunkArguments> & {
  issueId: number;
};
