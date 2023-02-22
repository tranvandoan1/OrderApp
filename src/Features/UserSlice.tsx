import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserAPI, { getAllUser, upload, uploadLogin } from '../API/Users';

export const getUser = createAsyncThunk('user/getUser', async () => {
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const { data: users } = await getAllUser();
  const userFind = users.find((item: any) => item._id == user.data._id);
  return userFind;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: [],
    loading: true,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUser.fulfilled, (state: any, action) => {
      state.loading = false;
      state.value = action.payload;
    });

  },
});
export default userSlice.reducer;
