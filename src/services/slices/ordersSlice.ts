import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getOrdersApi } from "@utils/burger-api";
import type { TOrder } from "@utils-types";

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const getOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/getOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось получить заказы'
    );
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 
          action.payload ??
          action.error.message ??
          'Не удалось получить заказы';
      });
  }
});

export default ordersSlice.reducer;