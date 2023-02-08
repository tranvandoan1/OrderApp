import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import UserAPI, {getAllUser, upload, uploadLogin} from '../API/Users';

export const getUser = createAsyncThunk('user/getUser', async () => {
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const {data: users} = await getAllUser();
  const userFind = users.find((item: any) => item._id == user.data._id);
  return userFind;
});
export const editNameAvatarUser = createAsyncThunk(
  'user/editNameAvatarUser',
  async data => {
    const logStorage: any = await AsyncStorage.getItem('user');
    const user = JSON.parse(logStorage);
    const {data: users} = await upload(data);
    const userFind = users.find((item: any) => item._id == user.data._id);
    return userFind;
  },
);
export const editLogin = createAsyncThunk('user/editLogin', async data => {
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const {data: users} = await uploadLogin(data);
  const userFind = users.find((item: any) => item._id == user.data._id);
  return userFind;
});
const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUser.fulfilled, (state: any, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(editNameAvatarUser.fulfilled, (state: any, action) => {
      state.value = action.payload;
    });
    builder.addCase(editLogin.fulfilled, (state: any, action) => {
      state.value = action.payload;
    });
  },
});
export default userSlice.reducer;
