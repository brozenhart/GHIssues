/* eslint-disable react/display-name */
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BookmarksStackNavigator,
  IssuesStackNavigator,
  NavigationRouteName,
} from '@/navigators';
import { Locale } from '@/config';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { TabBarIcon } from '@/components';

type BottomTabParamList = {
  [NavigationRouteName.ISSUES_SEARCH]: undefined;
  [NavigationRouteName.BOOKMARKS]: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

enableScreens();

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator initialRouteName={NavigationRouteName.ISSUES_SEARCH}>
          <Tab.Screen
            name={NavigationRouteName.ISSUES_SEARCH}
            component={IssuesStackNavigator}
            options={{
              tabBarLabel: Locale.TAB_BAR_LABEL_ISSUES,
              tabBarIcon: () => <TabBarIcon emoji={'🔍'} />,
            }}
          />
          <Tab.Screen
            name={NavigationRouteName.BOOKMARKS}
            component={BookmarksStackNavigator}
            options={{
              tabBarLabel: Locale.TAB_BAR_LABEL_BOOKMARKS,
              tabBarIcon: () => <TabBarIcon emoji={'🔖'} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
