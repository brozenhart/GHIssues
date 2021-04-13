import { BookmarksScreen, MemoIssueDetailScreen } from '@/screens';
import { createStackNavigator } from '@react-navigation/stack';
import { Locale } from 'config/locale';
import React from 'react';
import { BookmarksStackParamList, NavigationRouteName } from './types';

const BookmarksStack = createStackNavigator<BookmarksStackParamList>();

export const BookmarksStackNavigator = (): JSX.Element => {
  return (
    <BookmarksStack.Navigator initialRouteName={NavigationRouteName.BOOKMARKS}>
      <BookmarksStack.Screen
        name={NavigationRouteName.BOOKMARKS}
        component={BookmarksScreen}
        options={{
          title: Locale.BOOKMARKS_HEADER_TITLE,
        }}
      />
      <BookmarksStack.Screen
        name={NavigationRouteName.ISSUE_DETAILS}
        component={MemoIssueDetailScreen}
      />
    </BookmarksStack.Navigator>
  );
};
