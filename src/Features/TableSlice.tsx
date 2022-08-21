import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import TableAPI from '../API/TableAPI';
import {checkUserAsyncStorage} from '../checkUser';
export const getAllTable = createAsyncThunk('table/getAll', async () => {
  const {data: tables} = await TableAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataTable: any = [];
  const newData: any = [];
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].user_id == user.data._id) {
      tables[i].name = tables[i].name.replace(/[^0-9]/g, '');
      dataTable.push(tables[i]);
    }
  }

  dataTable.sort((a: any, b: any) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataTable.length; i++) {
    dataTable[i].name = `Bàn ${dataTable[i].name}`;
    newData.push(dataTable[i]);
  }
  return newData;
});
const tableSlice = createSlice({
  name: 'table',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAllTable.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default tableSlice.reducer;
