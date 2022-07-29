import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import CateAPI from './../API/CateAPI';

export const getAll = createAsyncThunk('categoris/getAll', async () => {
  const {data: categoris} = await CateAPI.getAll();
  return categoris;
});
const cateSlice = createSlice({
  name: 'categoris',
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
export default cateSlice.reducer