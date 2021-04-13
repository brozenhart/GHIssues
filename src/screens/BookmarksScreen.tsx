import { Color, Locale } from '@/config';
import { bookmarksSelectors } from '@/modules/bookmarks';
import { IssuesResponseData, showIssueDetails } from '@/modules/issues-search';
import { useAppDispatch } from '@/store';
import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';

export const BookmarksScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const issues = useSelector((state: RootState) =>
    bookmarksSelectors.selectAll(state),
  );

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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text>{Locale.BOOKMARKS_NO_ISSUES_BOOKMARKED}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={renderEmpty}
        data={issues}
        renderItem={renderItem}
        keyExtractor={item => `row-${item.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  emptyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 100,
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
