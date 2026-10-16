import { 
  createAsyncThunk,
  createSlice, 
  type PayloadAction
 } from "@reduxjs/toolkit";

import type { TUser } from "@utils-types";

import { 
  getUserApi, 
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  type TRegisterData
} from "@utils/burger-api";

import { deleteCookie, setCookie } from "@utils/cookie";

type TUserState = {
  user: TUser | null;
  isAuthenticated:boolean;
  isLoading: boolean;
  error: string | null;
};

type TUpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
}

const initialState : TUserState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

export const getUser = createAsyncThunk<
TUser,
void,
{ rejectValue: string }
>('user/getUser', async (_, { rejectWithValue }) =>  {
  try { 
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message: 'Не удалось получить пользователя'
    );
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string}
>('user/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось войти в аккаунт'
    );
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch(error) {
    return rejectWithValue(
      error instanceof Error
      ? error.message
      : 'Не удалось зарегистрировать пользователя'
    );
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  TUpdateUserData,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось обновить данные пользователя'
    );
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logoutUser', async(_, { rejectWithValue }) => {
  try {
    await logoutApi();

    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
      ? error.message
      : 'Не удалось выйти из аккаунта'
    );
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },

  extraReducers: (builder) => {
    builder 
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? action.error.message ?? 'Не удалось получить пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Не удалось войти в аккаунт';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          'Не удалось зарегистрировать пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 
          action.payload ??
          action.error.message ??
          'Не удалось обновить данные пользователя';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 
          action.payload ??
          action.error.message ??
          'Не удалось выйти из аккаунта';
      });
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;