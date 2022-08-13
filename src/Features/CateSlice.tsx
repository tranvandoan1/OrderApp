import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import CateAPI, {add, remove, upload} from './../API/CateAPI';

export const getAll = createAsyncThunk('categoris/getAll', async () => {
  const {data: categoris} = await CateAPI.getAll();
  return categoris;
});
export const addCate = createAsyncThunk(
  'categoris/addCate',
  async (data: any) => {
    const {data: categoris} = await add(data);
    return categoris;
  },
);
export const removeCate = createAsyncThunk(
  'categoris/removeCate',
  async (id: String) => {
    const {data: categoris} = await remove(id);
    return categoris;
  },
);
export const editCatee = createAsyncThunk(
  'categoris/editCatee',
  async (data: any) => {
    const {data: categoris} = await upload(data.id, data.data);
    console.log(categoris, 'thay rồi');
    return categoris;
  },
);
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
    builder.addCase(addCate.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(removeCate.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(editCatee.fulfilled, (state: any, action: any) => {
      console.log(action.payload, '32wqsdasar2r4ewds');
      state.value = action.payload;
    });
  },
});
export default cateSlice.reducer;
