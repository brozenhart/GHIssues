import { Constant, Locale } from '@/config';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NavigationRouteName } from 'navigators/types';
import { ThunkAPI } from 'root-types';
import { IssuesResponseData } from './models';
import { createAuthHeaders, validateRequiredFields } from 'utils';
import {
  DefaultThunkArguments,
  IssuesFilter,
  IssuesSearchState,
  IssuesSort,
  ShowIssueDetailsThunkArguments,
} from './types';
import { issuesAdapter, issuesSelectors } from './entity-adapters';

export const ActionTypes = {
  FETCH_ISSUES: 'issues-search/fetchIssues',
  SHOW_ISSUE_DETAILS: 'issues-search/showIssueDetails',
};

export const fetchIssues = createAsyncThunk<
  IssuesResponseData[],
  DefaultThunkArguments,
  ThunkAPI
>(
  ActionTypes.FETCH_ISSUES,
  async ({ navigation }, { extra, rejectWithValue, getState, dispatch }) => {
    const {
      organization,
      repository,
      page,
      filter,
      sort,
      isLastPageReached,
    } = getState().issuesSearch;
    const { get } = extra.networkService;
    if (isLastPageReached)
      rejectWithValue({ message: Locale.ERROR_ISSUES_NOT_FOUND });

    try {
      await validateRequiredFields([
        {
          name: Locale.ISSUES_SEARCH_ORGANIZATION_FIELD_NAME,
          value: organization,
        },
        { name: Locale.ISSUES_SEARCH_REPOSITORY_FIELD_NAME, value: repository },
      ]);
      const response = await get<IssuesResponseData[]>(
        `repos/${organization}/${repository}/issues`,
        createAuthHeaders(
          Constant.API.AUTH.username,
          Constant.API.AUTH.password,
        ),
        {
          ...(page && { page }),
          ...(filter && { state: filter }),
          ...(sort && { sort }),
        },
      );
      if (response.data.length === 0) {
        dispatch(setLastPageReached());
        return rejectWithValue({ message: Locale.ERROR_NO_ISSUES });
      }

      if (navigation !== undefined && page === 1)
        navigation.navigate(NavigationRouteName.ISSUES);
      return response.data;
    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  },
);

export const showIssueDetails = createAsyncThunk<
  void,
  ShowIssueDetailsThunkArguments,
  ThunkAPI
>(
  ActionTypes.SHOW_ISSUE_DETAILS,
  ({ navigation, issueId }, { dispatch, getState }) => {
    const issue = issuesSelectors.selectById(getState(), issueId);
    if (issue !== undefined) {
      dispatch(setSelectedIssue(issue));
      navigation.navigate(NavigationRouteName.ISSUE_DETAILS, { issue });
    }
  },
);

export const initialState: IssuesSearchState = issuesAdapter.getInitialState({
  isLoading: false,
  page: 1,
  isLastPageReached: false,
  filter: 'all',
  sort: 'updated',
});

const issuesSearchSlice = createSlice({
  name: 'issues-search',
  initialState,
  reducers: {
    setOrganization: (state, action: PayloadAction<string>) => {
      state.organization = action.payload;
    },
    setRepository: (state, action: PayloadAction<string>) => {
      state.repository = action.payload;
    },
    setNextPage: state => {
      state.page += 1;
    },
    setLastPageReached: state => {
      state.isLastPageReached = true;
    },
    setIssuesFilter: (state, action: PayloadAction<IssuesFilter>) => {
      state.page = initialState.page;
      state.entities = initialState.entities;
      state.ids = initialState.ids;
      state.isLastPageReached = false;
      state.filter = action.payload;
    },
    setIssuesSort: (state, action: PayloadAction<IssuesSort>) => {
      state.page = initialState.page;
      state.entities = initialState.entities;
      state.ids = initialState.ids;
      state.isLastPageReached = false;
      state.sort = action.payload;
    },
    setSelectedIssue: (state, action: PayloadAction<IssuesResponseData>) => {
      state.selectedIssue = action.payload;
    },
    resetIssues: state => {
      state.entities = initialState.entities;
      state.ids = initialState.ids;
      state.filter = initialState.filter;
      state.sort = initialState.sort;
      state.page = initialState.page;
      state.isLastPageReached = initialState.isLastPageReached;
      state.selectedIssue = undefined;
    },
    resetError: state => {
      state.error = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchIssues.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      state.isLoading = false;
      issuesAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(fetchIssues.rejected, (state, action) => {
      const { payload }: any = action;
      state.isLoading = false;
      state.error = action.meta.rejectedWithValue
        ? { message: payload.message }
        : action.error;
    });
  },
});

export const {
  setOrganization,
  setRepository,
  setNextPage,
  setLastPageReached,
  setIssuesFilter,
  setIssuesSort,
  setSelectedIssue,
  resetIssues,
  resetError,
} = issuesSearchSlice.actions;

export const issuesSearchReducer = issuesSearchSlice.reducer;
