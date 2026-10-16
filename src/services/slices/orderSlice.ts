import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getOrderByNumberApi } from "@utils/burger-api";
import type { TOrder } from "@utils-types";

type TOrderState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  isLoading: false,
  error: null
};

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);

    if (!response.orders.length) {
      return rejectWithValue('Заказ не найден');
    }

    return response.orders[0];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось получить заказ'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 
          action.payload ??
          action.error.message ??
          'Не удалось получить заказ';
      });
  }
});

export default orderSlice.reducer;