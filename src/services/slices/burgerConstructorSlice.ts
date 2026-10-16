import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { orderBurgerApi } from "@utils/burger-api";

import type {
  TConstructorIngredient,
  TConstructorState,
  TOrder
} from '@utils-types';

type TBurgerConstructorState = TConstructorState & {
  orderRequest: boolean;
  order: TOrder | null;
  orderError: string | null;
}

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients:[],
  orderRequest: false,
  order: null,
  orderError: null
};

export const orderBurger = createAsyncThunk(
  'burgerConstructor/orderBurger',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },

    addIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients.push(action.payload);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state, 
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      
      const [ingredient] = state.ingredients.splice(fromIndex, 1);

      state.ingredients.splice(toIndex, 0, ingredient);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.order = null;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = 
          action.error.message ?? 'Не удалось оформить заказ';
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;