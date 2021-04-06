import { Color, Locale } from '@/config';
import {
  fetchRepositories,
  repositoriesSelectors,
} from '@/modules/organization';
import { RespositoryResponseData } from '@/modules/organization/models';
import { useAppDispatch } from '@/store';
import React, { memo } from 'react';
import {
  ActivityIndicator,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';

const RepositoriesScreen = (): JSX.Element => {
  const loading = useSelector((state: RootState) => state.organization.loading);
  const repositories = useSelector(repositoriesSelectors.selectAll);
  const dispatch = useAppDispatch();

  const renderItem = ({
    item,
  }: ListRenderItemInfo<RespositoryResponseData>) => {
    return (
      <View style={styles.listRow}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.description}</Text>
        <Text
          style={
            styles.small
          }>{`${Locale.REPOSITORIES_OPEN_ISSUES_TITLE} ${item.open_issues_count}`}</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderTitle}>
        {Locale.REPOSITORIES_EMPTY_TITLE}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
        {loading === 'pending' && <ActivityIndicator color={Color.DIM_GREY} />}
      </View>
      <FlatList
        ListEmptyComponent={renderEmpty}
        data={repositories}
        renderItem={renderItem}
        keyExtractor={item => `row-${item.id}`}
      />
    </View>
  );
};

export const MemoRepositoriesScreen = memo(RepositoriesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  label: {
    flex: 0,
  },
  listRow: {
    backgroundColor: Color.WHITE,
    borderBottomColor: Color.LIGHT_GREY,
    borderBottomWidth: 1,
    flex: 1,
    minHeight: 100,
    paddingLeft: 10,
    paddingRight: 30,
    paddingVertical: 20,
  },
  placeholderContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  placeholderTitle: {
    color: Color.DIM_GREY,
  },
  row: {
    backgroundColor: Color.WHITE,
    flex: 0,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  small: {
    flex: 1,
    fontSize: 11,
    marginTop: 5,
    textAlign: 'right',
  },
  subtitle: {
    flex: 1,
  },
  textInput: {
    backgroundColor: Color.WHITE,
    flex: 1,
    marginLeft: 10,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
});
