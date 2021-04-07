import { Color } from '@/config';
import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from 'root-types';

const IssueDetailScreen = (): JSX.Element => {
  const issue = useSelector(
    (state: RootState) => state.issuesSearch.selectedIssue,
  );
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.header}>{issue!.title}</Text>
      <Text>{issue!.body}</Text>
    </ScrollView>
  );
};

export const MemoIssusDetailScreen = memo(IssueDetailScreen);

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
