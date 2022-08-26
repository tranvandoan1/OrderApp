import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import FloorAPI from './../API/FloorAPI';
export const getAllFloor = createAsyncThunk('floor/getAllFloor', async () => {
  const {data: floors} = await FloorAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataFloor: any = [];
  const newData: any = [];
  for (let i = 0; i < floors.length; i++) {
    if (floors[i].user_id == user.data._id) {
      floors[i].name = floors[i].name.replace(/[^0-9]/g, '');
      dataFloor.push(floors[i]);
    }
  }

  dataFloor.sort((a: any, b: any) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataFloor.length; i++) {
    dataFloor[i].name = `Tầng ${dataFloor[i].name}`;
    newData.push(dataFloor[i]);
  }
  return newData;
});
const floorSlice = createSlice({
  name: 'floor',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAllFloor.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default floorSlice.reducer;
