import { Color, Locale } from '@/config';
import { fetchRepositories } from '@/modules/organization';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const RepositoriesScreen = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{Locale.REPOSITORIES_TEXTFIELD_LABEL}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={Locale.REPOSITORIES_TEXTFIELD_PLACEHOLDER}
          autoCapitalize="none"
          blurOnSubmit={true}
          returnKeyType="search"
          onSubmitEditing={({ nativeEvent: { text } }) =>
            dispatch(fetchRepositories(text))
          }
        />
      </View>
    </SafeAreaView>
  );
};

export const MemoRepositoriesScreen = memo(RepositoriesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  label: {
    flex: 0,
  },
  row: {
    backgroundColor: Color.WHITE,
    flex: 0,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  textInput: {
    backgroundColor: Color.WHITE,
    flex: 1,
    marginLeft: 10,
  },
});
