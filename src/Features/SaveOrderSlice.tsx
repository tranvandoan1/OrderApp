import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import SaveorderAPI from './../API/SaveOrder';
export const getAllSaveOrder = createAsyncThunk(
  'saveOrder/getAll',
  async () => {
    const {data: saveorder} = await SaveorderAPI.getAll();
    return saveorder;
  },
);
const saveOrderSlice = createSlice({
  name: 'table',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAllSaveOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default saveOrderSlice.reducer;
