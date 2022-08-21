import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import ProAPI from './../API/ProAPI';

export const getAllPro = createAsyncThunk('products/getAllPro', async () => {
  const {data: products} = await ProAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataPro: any = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].user_id == user.data._id) {
      dataPro.push(products[i]);
    }
  }

  return dataPro;
});
const floorSlice = createSlice({
  name: 'products',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAllPro.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default floorSlice.reducer;
