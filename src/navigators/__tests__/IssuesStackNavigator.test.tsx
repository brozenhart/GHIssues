import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { IssuesStackNavigator } from 'navigators/IssuesStackNavigator';
import { store } from '@/store';
import { Provider } from 'react-redux';

describe('IssuesStackNavigator', () => {
  let component: JSX.Element;

  beforeAll(() => {
    component = (
      <Provider store={store}>
        <NavigationContainer>
          <IssuesStackNavigator />
        </NavigationContainer>
      </Provider>
    );
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('renders correctly', () => {
    const page = render(component);
    expect(page.toJSON()).toMatchSnapshot();
  });

  test('search for issues and navigate to issues screen', async () => {
    const { getByPlaceholderText } = render(component);

    const organizationInput = getByPlaceholderText(/facebook, apple.../i);
    expect(organizationInput).toBeTruthy();

    fireEvent.changeText(organizationInput, 'apple');

    const repositoryInput = getByPlaceholderText(/react, swift.../i);
    expect(repositoryInput).toBeTruthy();

    fireEvent.changeText(repositoryInput, 'swift');
  });
});
