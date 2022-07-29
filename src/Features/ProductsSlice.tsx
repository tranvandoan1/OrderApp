import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import ProAPI from './../API/ProAPI';
// type  value={

//     name: String;
//     photo: String;
//     price: Number;
//     cate_id: String;
//     check: Boolean;
//   }

export const getAll = createAsyncThunk('products/getAll', async () => {
  const {data: products} = await ProAPI.getAll();
  return products;
});
const floorSlice = createSlice({
  name: 'products',
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
export default floorSlice.reducer;
