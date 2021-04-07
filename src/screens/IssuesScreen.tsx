import { Color, Locale } from '@/config';
import {
  fetchIssues,
  IssuesFilter,
  IssuesResponseData,
  issuesSelectors,
  setIssuesFilter,
  setNextPage,
} from '@/modules/issues-search';
import { useAppDispatch } from '@/store';
import React, { useEffect } from 'react';
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
import SwitchSelector from 'react-native-switch-selector';

export const IssuesScreen = (): JSX.Element => {
  const { filter, page, isLoading } = useSelector(
    (state: RootState) => state.issuesSearch,
  );
  const issues = useSelector(issuesSelectors.selectAll);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIssues({}));
  }, [dispatch, filter, page]);

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
      <View style={styles.filters}>
        <SwitchSelector
          initial={0}
          onPress={value => dispatch(setIssuesFilter(value as IssuesFilter))}
          textColor={Color.DIM_GREY}
          selectedColor={Color.WHITE}
          buttonColor={Color.DIM_GREY}
          borderColor={Color.DIM_GREY}
          hasPadding
          options={[
            { label: 'All', value: 'all' },
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' },
          ]}
        />
      </View>
      <FlatList
        ListFooterComponent={renderFooter}
        data={issues}
        renderItem={renderItem}
        keyExtractor={item => `row-${item.id}`}
        onEndReachedThreshold={0}
        onEndReached={() => {
          if (!isLoading) dispatch(setNextPage());
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
  filters: {
    backgroundColor: Color.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
