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

export interface OrganizationState {
  organization?: string;
  repository?: string;
  issues: EntityState<IssuesResponseData>;
  isLoading: boolean;
  page: number;
  state: 'all' | 'open' | 'closed';
  sort: 'updated' | 'created' | 'comments';
}

export const ActionTypes = {
  FETCH_ISSUES: 'issues-search/fetchIssues',
};

export type FetchIssuesArguments = {
  navigation?: ReturnType<typeof useNavigation>;
};

export const fetchIssues = createAsyncThunk<
  IssuesResponseData[],
  FetchIssuesArguments,
  ThunkAPI
>(
  ActionTypes.FETCH_ISSUES,
  async ({ navigation }, { extra, rejectWithValue, getState }) => {
    try {
      const {
        organization,
        repository,
        page,
        state,
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
          ...(state && { state }),
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

const issuesAdapter = createEntityAdapter<IssuesResponseData>({
  selectId: repo => repo.id,
});

export const initialState: OrganizationState = {
  issues: issuesAdapter.getInitialState(),
  isLoading: false,
  page: 1,
  state: 'all',
  sort: 'updated',
};

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
      state.page = 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchIssues.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchIssues.fulfilled, (state, action) => {
      state.isLoading = false;
      issuesAdapter.upsertMany(state.issues, action.payload);
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
} = issuesSearchSlice.actions;

export const issuesSelectors = issuesAdapter.getSelectors<RootState>(
  state => state.issuesSearch.issues,
);

export const issuesSearchReducer = issuesSearchSlice.reducer;