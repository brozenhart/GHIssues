import { MemoRepositoriesScreen } from '@/screens';
import { createStackNavigator } from '@react-navigation/stack';
import { Locale } from 'config/locale';
import React from 'react';
import { NavigationRouteName } from './types';

const IssuesStack = createStackNavigator();

export const IssuesStackNavigator = (): JSX.Element => {
  return (
    <IssuesStack.Navigator initialRouteName={NavigationRouteName.REPOSITORIES}>
      <IssuesStack.Screen
        name={NavigationRouteName.REPOSITORIES}
        component={MemoRepositoriesScreen}
        options={{
          title: Locale.REPOSITORIES_HEADER_TITLE,
        }}
      />
    </IssuesStack.Navigator>
  );
};
