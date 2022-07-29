import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import TableAPI from '../API/TableAPI';
export const getAllTable = createAsyncThunk('table/getAll', async () => {
  const {data: tables} = await TableAPI.getAll();
  return tables;
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
