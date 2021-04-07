import { Constant } from '@/config';
import { Buffer } from 'buffer';
import { useNavigation } from '@react-navigation/core';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { NavigationRouteName } from 'navigators/types';
import { RootState, ThunkAPI } from 'root-types';
import { IssuesResponseData } from './models';

export type IssuesFilter = 'all' | 'open' | 'closed';
export type IssuesSort = 'updated' | 'created' | 'comments';

export type OrganizationState = EntityState<IssuesResponseData> & {
  organization?: string;
  repository?: string;
  isLoading: boolean;
  page: number;
  filter: IssuesFilter;
  sort: IssuesSort;
  selectedIssue?: IssuesResponseData;
};

export const ActionTypes = {
  FETCH_ISSUES: 'issues-search/fetchIssues',
  SHOW_ISSUE_DETAILS: 'issues-search/showIssueDetails',
};

export type DefaultThunkArguments = {
  navigation?: ReturnType<typeof useNavigation>;
};

export const fetchIssues = createAsyncThunk<
  IssuesResponseData[],
  DefaultThunkArguments,
  ThunkAPI
>(
  ActionTypes.FETCH_ISSUES,
  async ({ navigation }, { extra, rejectWithValue, getState }) => {
    try {
      const {
        organization,
        repository,
        page,
        filter,
        sort,
      } = getState().issuesSearch;
      const { get } = extra.networkService;
      const response = await get<IssuesResponseData[]>(
        `repos/${organization}/${repository}/issues`,
        {
          Authorization: `Basic ${Buffer.from(
            `${Constant.API.AUTH.username}:${Constant.API.AUTH.password}`,
          ).toString('base64')}`,
        },
        {
          ...(page && { page }),
          ...(filter && { state: filter }),
          ...(sort && { sort }),
        },
      );

      if (navigation !== undefined && page === 1)
        navigation.navigate(NavigationRouteName.ISSUES);
      return response.data;
    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  },
);

type ShowIssueDetailsThunkArguments = Required<DefaultThunkArguments> & {
  issueId: number;
};

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

const issuesAdapter = createEntityAdapter<IssuesResponseData>({
  selectId: data => data.id,
});

export const initialState: OrganizationState = issuesAdapter.getInitialState({
  isLoading: false,
  page: 1,
  filter: 'all',
  sort: 'updated',
  organization: 'facebook',
  repository: 'react',
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
    resetPage: state => {
      state.page = initialState.page;
    },
    setIssuesFilter: (state, action: PayloadAction<IssuesFilter>) => {
      state.entities = initialState.entities;
      state.ids = initialState.ids;
      state.filter = action.payload;
    },
    setIssuesSort: (state, action: PayloadAction<IssuesSort>) => {
      state.entities = initialState.entities;
      state.ids = initialState.ids;
      state.sort = action.payload;
    },
    setSelectedIssue: (state, action: PayloadAction<IssuesResponseData>) => {
      state.selectedIssue = action.payload;
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
    builder.addCase(fetchIssues.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {
  setOrganization,
  setRepository,
  setNextPage,
  resetPage,
  setIssuesFilter,
  setIssuesSort,
  setSelectedIssue,
} = issuesSearchSlice.actions;

export const issuesSelectors = issuesAdapter.getSelectors<RootState>(
  state => state.issuesSearch,
);

export const issuesSearchReducer = issuesSearchSlice.reducer;
