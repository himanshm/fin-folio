import type { User } from '@/types';
import { createAppAsyncThunk } from './asyncThunkWithTypes';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  clearUserIdentifier,
  setUserIdentifier
} from './baseApi';

export const fetchUser = createAppAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet('/users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUser = createAppAsyncThunk(
  'user/createUser',
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await apiPost('/user', user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAppAsyncThunk(
  'user/updateUserProfile',
  async (user: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await apiPut('/user/profile', user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteUserAccount = createAppAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiDelete('/user/delete-account');
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const signInUser = createAppAsyncThunk(
  'user/signIn',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiPost<{ user: User; token: string }>(
        '/auth/sign-in',
        credentials
      );
      if (response.data.token) {
        setUserIdentifier(response.data.token);
      }
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const signOutUser = createAppAsyncThunk('user/signOut', async () => {
  try {
    await apiPost('/auth/sign-out');
    clearUserIdentifier();
    return null;
  } catch (error) {
    clearUserIdentifier();
    return null;
  }
});
