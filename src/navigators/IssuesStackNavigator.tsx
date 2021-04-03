import { MemoRepoLocatorScreen } from '@/screens';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const IssuesStack = createStackNavigator();

export const IssuesStackNavigator = (): JSX.Element => {
  return (
    <IssuesStack.Navigator>
      <IssuesStack.Screen
        name="RepoLocator"
        component={MemoRepoLocatorScreen}
      />
    </IssuesStack.Navigator>
  );
};
