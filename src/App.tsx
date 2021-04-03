import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IssuesStackNavigator, NavigationRouteName } from '@/navigators';
import { Strings } from '@/config';

const Tab = createBottomTabNavigator();

export const App = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName={NavigationRouteName.ISSUES}>
        <Tab.Screen
          name={NavigationRouteName.ISSUES}
          component={IssuesStackNavigator}
          options={{
            tabBarLabel: Strings.TAB_BAR_LABEL_ISSUES,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
