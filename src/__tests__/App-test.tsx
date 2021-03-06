import { render } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import { App } from '../App';

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should render correctly', () => {
    const page = render(<App />);
    expect(page.toJSON()).toMatchSnapshot();
  });
});
