import {
  IssuesScreen,
  MemoIssueDetailScreen,
  MemoIssuesSearchScreen,
} from '@/screens';
import { createStackNavigator } from '@react-navigation/stack';
import { Locale } from 'config/locale';
import React from 'react';
import { IssuesStackParamList, NavigationRouteName } from './types';

const IssuesStack = createStackNavigator<IssuesStackParamList>();

export const IssuesStackNavigator = (): JSX.Element => {
  return (
    <IssuesStack.Navigator initialRouteName={NavigationRouteName.ISSUES_SEARCH}>
      <IssuesStack.Screen
        name={NavigationRouteName.ISSUES_SEARCH}
        component={MemoIssuesSearchScreen}
        options={{
          title: Locale.ISSUES_SEARCH_HEADER_TITLE,
        }}
      />
      <IssuesStack.Screen
        name={NavigationRouteName.ISSUES}
        component={IssuesScreen}
        options={{
          title: Locale.ISSUES_HEADER_TITLE,
        }}
      />
      <IssuesStack.Screen
        name={NavigationRouteName.ISSUE_DETAILS}
        component={MemoIssueDetailScreen}
      />
    </IssuesStack.Navigator>
  );
};
