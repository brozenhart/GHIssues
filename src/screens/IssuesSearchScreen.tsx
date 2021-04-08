import { Color, Locale } from '@/config';
import {
  fetchIssues,
  resetError,
  setOrganization,
  setRepository,
} from '@/modules/issues-search';
import { useAppDispatch } from '@/store';
import { showToast } from 'utils';
import { useNavigation } from '@react-navigation/core';
import React, { memo, useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';

const IssuesSearchScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const { organization, repository, error } = useSelector(
    (state: RootState) => state.issuesSearch,
  );
  const isLoading = useSelector(
    (state: RootState) => state.issuesSearch.isLoading,
  );
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if (error !== undefined) showToast(error, () => dispatch(resetError()));
  }, [dispatch, error]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {Locale.ISSUES_SEARCH_TEXTFIELD_LABEL_ORGANIZATION}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={Locale.ISSUES_SEARCH_TEXTFIELD_PLACEHOLDER_ORGANIZATION}
          autoCapitalize="none"
          defaultValue={organization}
          onChangeText={text => dispatch(setOrganization(text))}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>
          {Locale.ISSUES_SEARCH_TEXTFIELD_LABEL_REPOSITORY}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={Locale.ISSUES_SEARCH_TEXTFIELD_PLACEHOLDER_REPOSITORY}
          autoCapitalize="none"
          defaultValue={repository}
          onChangeText={text => dispatch(setRepository(text))}
        />
      </View>
      <Button
        title={'Search'}
        onPress={() => dispatch(fetchIssues({ navigation }))}
      />
      <View style={styles.container}>
        {isLoading && <ActivityIndicator color={Color.DIM_GREY} />}
      </View>
    </View>
  );
};

export const MemoIssuesSearchScreen = memo(IssuesSearchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
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
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: Color.WHITE,
    flex: 1,
    marginLeft: 10,
  },
});
