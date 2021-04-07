import { Color, Locale } from '@/config';
import {
  fetchIssues,
  IssuesResponseData,
  issuesSelectors,
  setNextPage,
} from '@/modules/issues-search';
import { useAppDispatch } from '@/store';
import React from 'react';
import {
  ActivityIndicator,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';

export const IssuesScreen = (): JSX.Element => {
  const issues = useSelector(issuesSelectors.selectAll);
  const isLoading = useSelector(
    (state: RootState) => state.issuesSearch.isLoading,
  );
  const dispatch = useAppDispatch();

  const renderItem = ({ item }: ListRenderItemInfo<IssuesResponseData>) => {
    return (
      <View style={styles.listRow}>
        <Text style={styles.title}>{item.title}</Text>
        <Text
          style={
            styles.small
          }>{`${Locale.ISSUES_STATUS_TITLE} ${item.state}`}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={[styles.listRow, styles.footer]}>
        {isLoading && <ActivityIndicator color={Color.DIM_GREY} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListFooterComponent={renderFooter}
        data={issues}
        renderItem={renderItem}
        keyExtractor={item => `row-${item.id}`}
        onEndReachedThreshold={0}
        onEndReached={() => {
          if (!isLoading) {
            dispatch(setNextPage());
            dispatch(fetchIssues({}));
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRow: {
    backgroundColor: Color.WHITE,
    borderBottomColor: Color.LIGHT_GREY,
    borderBottomWidth: 1,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 30,
    paddingVertical: 20,
  },
  small: {
    flex: 1,
    fontSize: 11,
    marginTop: 5,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
});
