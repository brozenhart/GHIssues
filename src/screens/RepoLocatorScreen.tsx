import React, { memo } from 'react';
import { Text, View } from 'react-native';

const RepoLocatorScreen = (): JSX.Element => {
  return (
    <View>
      <Text>{'Repo Locator Screen'}</Text>
    </View>
  );
};

export const MemoRepoLocatorScreen = memo(RepoLocatorScreen);
