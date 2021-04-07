import { Color, Locale } from '@/config';
import {
  fetchIssues,
  IssuesFilter,
  IssuesResponseData,
  issuesSelectors,
  IssuesSort,
  resetIssues,
  setIssuesFilter,
  setIssuesSort,
  setNextPage,
  showIssueDetails,
} from '@/modules/issues-search';
import { useAppDispatch } from '@/store';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';
import SwitchSelector from 'react-native-switch-selector';
import { useNavigation } from '@react-navigation/core';

export const IssuesScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const { filter, sort, page, isLoading } = useSelector(
    (state: RootState) => state.issuesSearch,
  );
  const issues = useSelector(issuesSelectors.selectAll);
  const dispatch = useAppDispatch();
  const notInitialRender = useRef(false);

  useEffect(() => {
    if (notInitialRender.current) dispatch(fetchIssues({}));
    else notInitialRender.current = true;
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    return () => {
      dispatch(resetIssues());
    };
  }, [dispatch]);

  const renderItem = ({ item }: ListRenderItemInfo<IssuesResponseData>) => {
    return (
      <Pressable
        style={styles.listRow}
        onPress={() =>
          dispatch(showIssueDetails({ navigation, issueId: item.id }))
        }>
        <Text style={styles.title}>{item.title}</Text>
        <Text
          style={
            styles.small
          }>{`${Locale.ISSUES_STATUS_TITLE} ${item.state}`}</Text>
      </Pressable>
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
          {...switchStyleProps}
          initial={0}
          onPress={value => dispatch(setIssuesFilter(value as IssuesFilter))}
          options={[
            { label: Locale.ISSUES_FILTER_OPTION_LABEL_ALL, value: 'all' },
            { label: Locale.ISSUES_FILTER_OPTION_LABEL_OPEN, value: 'open' },
            {
              label: Locale.ISSUES_FILTER_OPTION_LABEL_CLOSED,
              value: 'closed',
            },
          ]}
        />
      </View>
      <View style={styles.filters}>
        <Text style={styles.label}>{Locale.ISSUES_SORT_LABEL}</Text>
        <SwitchSelector
          {...switchStyleProps}
          initial={0}
          onPress={value => dispatch(setIssuesSort(value as IssuesSort))}
          options={[
            {
              label: Locale.ISSUES_SORT_OPTION_LABEL_UPDATED,
              value: 'updated',
            },
            {
              label: Locale.ISSUES_SORT_OPTION_LABEL_CREATED,
              value: 'created',
            },
            {
              label: Locale.ISSUES_SORT_OPTION_LABEL_COMMENTS,
              value: 'comments',
            },
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

const switchStyleProps = {
  textColor: Color.DIM_GREY,
  selectedColor: Color.WHITE,
  buttonColor: Color.DIM_GREY,
  borderColor: Color.DIM_GREY,
  hasPadding: true,
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
  label: {
    marginBottom: 5,
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
