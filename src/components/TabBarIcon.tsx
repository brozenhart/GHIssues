import React from 'react';
import { Text } from 'react-native';

type Props = {
  emoji: string;
};

export const TabBarIcon = ({ emoji }: Props): JSX.Element => {
  return <Text>{emoji}</Text>;
};
