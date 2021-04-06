import { Constant } from '@/config';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkAPI } from 'root-types';
import { RespositoryResponseData } from './models';

export interface OrganizationState {
  name?: string;
  repositories: EntityState<RespositoryResponseData>;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  etag?: string;
}

export const ActionTypes = {
  FETCH_REPOSITORIES: 'organization/fetchRepositories',
};

export const fetchRepositories = createAsyncThunk<
  RespositoryResponseData[],
  string,
  ThunkAPI
>(
  ActionTypes.FETCH_REPOSITORIES,
  async (
    organization: string,
    { extra, dispatch, getState, rejectWithValue },
  ) => {
    try {
      const { etag } = getState().organization;
      const { get } = extra.networkService;
      const headers = {
        ...Constant.API.AUTH_HEADER,
        ...(etag && { 'If-None-Match': etag }),
      };
      const response = await get<RespositoryResponseData[]>(
        `orgs/${organization}/repos`,
        headers,
      );
      if (response.status !== 304) {
        dispatch(setOrganizationName(organization));
        dispatch(setEtag(response.headers.etag));
      }
      return response.data;
    } catch (err) {
      if (!err.response) throw err;
      return rejectWithValue(err.response.data);
    }
  },
);

const repositoriesAdapter = createEntityAdapter<RespositoryResponseData>({
  selectId: repo => repo.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const initialState: OrganizationState = {
  repositories: repositoriesAdapter.getInitialState(),
  loading: 'idle',
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganizationName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEtag: (state, action: PayloadAction<string>) => {
      state.etag = action.payload;
    },
    resetLoading: state => {
      state.loading = 'idle';
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRepositories.pending, state => {
      state.loading = 'pending';
    });
    builder.addCase(fetchRepositories.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      repositoriesAdapter.setAll(state.repositories, action.payload);
    });
    builder.addCase(fetchRepositories.rejected, state => {
      state.loading = 'failed';
    });
  },
});

export const {
  setOrganizationName,
  setEtag,
  resetLoading,
} = organizationSlice.actions;

export const repositoriesSelectors = repositoriesAdapter.getSelectors<RootState>(
  state => state.organization.repositories,
);

export const organizationReducer = organizationSlice.reducer;
