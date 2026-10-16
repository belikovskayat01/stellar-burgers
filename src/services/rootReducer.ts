import { combineReducers } from "@reduxjs/toolkit";

import burgerConstructorReducer from './slices/burgerConstructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import orderReducer from './slices/orderSlice';


export const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  order: orderReducer
});