import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@utils/burger-api';

import type { TFeedState, TOrdersData } from '@utils-types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const getFeed = createAsyncThunk<TOrdersData, void, { rejectValue: string }>(
  'feed/getFeed',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось получить ленту заказов'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось получить ленту заказов';
      });
  },
});

export default feedSlice.reducer;
