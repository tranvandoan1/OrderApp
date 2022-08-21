// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// export const checkUserStorage = createAsyncThunk('checkuser/checkUser', async () => {
//   const logStorage: any = await AsyncStorage.getItem('user');
//   const user = JSON.parse(logStorage);
//   return user.data;
// });
// const checkUserSlice = createSlice({
//   name: 'checkuser',
//   initialState: {
//     value: [],
//   },
//   reducers: {},
//   extraReducers: (builder: any) => {
//     builder.addCase(checkUserStorage.fulfilled, (state: any, action: any) => {
//       state.value = action.payload;
//     });
//   },
// });
// export default checkUserSlice.reducer;
