import type { UserState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUser,
  createUser,
  updateUserProfile,
  deleteUserAccount,
  signInUser,
  signOutUser
} from '../api/userEndPoints';

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Something went wrong';
      });
  }
});

export default userSlice.reducer;
