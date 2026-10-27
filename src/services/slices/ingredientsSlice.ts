import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@utils/burger-api';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>(
  'ingredients/getIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось получить ингредиенты'
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { ingredients: TIngredientsState };

      return !state.ingredients.isLoading;
    },
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Не удалось получить ингредиенты';
      });
  },
});

export default ingredientsSlice.reducer;
