import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import FloorAPI from './../API/FloorAPI';
export const getAll = createAsyncThunk('floor/getAll', async () => {
  const {data: floors} = await FloorAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataFloor:any = [];
  floors.filter((item: any) => {
    if (item.user_id == user.data._id) {
      dataFloor.push(item);
    }
  });
  return dataFloor;
});
const floortSlice = createSlice({
  name: 'floor',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAll.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default floortSlice.reducer;
