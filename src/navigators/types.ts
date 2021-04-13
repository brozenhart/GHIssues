import { IssuesResponseData } from '@/modules/issues-search/models';

export const NavigationRouteName = {
  ISSUES_SEARCH: 'IssuesSearch',
  ISSUES: 'Issues',
  ISSUE_DETAILS: 'IssueDetails',
  BOOKMARKS: 'Bookmarks',
} as const;

export type IssuesStackParamList = {
  [NavigationRouteName.ISSUES_SEARCH]: undefined;
  [NavigationRouteName.ISSUES]: undefined;
  [NavigationRouteName.ISSUE_DETAILS]: { issue: IssuesResponseData };
};
export type BookmarksStackParamList = {
  [NavigationRouteName.BOOKMARKS]: undefined;
  [NavigationRouteName.ISSUE_DETAILS]: { issue: IssuesResponseData };
};
