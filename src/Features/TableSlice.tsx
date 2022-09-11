import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import TableAPI, {add, remove, upload, uploadBookTable} from '../API/TableAPI';
async function tableAll() {
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
}
export const getAllTable = createAsyncThunk('table/getAllTable', async () => {
  return tableAll();
});

export const addTable = createAsyncThunk(
  'table/addTable',
  async (data: any) => {
    await add(data);
    return tableAll();
  },
);
export const editBookTable = createAsyncThunk(
  'table/uploadBookTable',
  async (data: any) => {
    await uploadBookTable(data);
    return tableAll();
  },
);
export const removeTable = createAsyncThunk(
  'table/removeTable',
  async (id: String) => {
    await remove(id);
    return tableAll();
  },
);
export const editTable = createAsyncThunk(
  'table/editTable',
  async (data: any) => {
    await upload(data.id, data.data);
    return tableAll();
  },
);
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
    builder.addCase(addTable.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(removeTable.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(editTable.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(editBookTable.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default tableSlice.reducer;
