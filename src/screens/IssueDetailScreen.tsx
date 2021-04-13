import { Color, Locale } from '@/config';
import { bookmarksSelectors, toggleBookmark } from '@/modules/bookmarks';
import { useAppDispatch } from '@/store';
import React, { memo, useLayoutEffect } from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';

type Props = {
  navigation: any;
};

const IssueDetailScreen = ({ navigation }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const issue = useSelector(
    (state: RootState) => state.issuesSearch.selectedIssue,
  );
  const isBookmarked = useSelector(
    (state: RootState) =>
      bookmarksSelectors.selectById(state, issue!.id) !== undefined,
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <Button
          title={
            isBookmarked
              ? Locale.ISSUE_DETAILS_UNBOOKMARK
              : Locale.ISSUE_DETAILS_BOOKMARK
          }
          onPress={() => dispatch(toggleBookmark({ issue: issue! }))}
        />
      ),
    });
  }, [dispatch, navigation, isBookmarked, issue]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.header}>{issue!.title}</Text>
      <Text>{issue!.body}</Text>
    </ScrollView>
  );
};

export const MemoIssueDetailScreen = memo(IssueDetailScreen);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scroll: {
    backgroundColor: Color.WHITE,
  },
});
