import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import OrderAPI, {add, remove, upload} from '../API/Order';
async function getAll() {
  const {data: orders} = await OrderAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataOrder = [];
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].user_id == user.data._id) {
      await dataOrder.push(orders[i]);
    }
  }

  return dataOrder;
}
export const getAllOrder = createAsyncThunk('order/getAllOrder', async () => {
  return getAll();
});
export const addOrder = createAsyncThunk('order/addOrder', async data => {
  await add(data);
  return getAll();
});
export const uploadOrder = createAsyncThunk(
  'order/uploadOrder',
  async (data: any) => {
    await upload(data.id, data.data);
    return getAll();
  },
);
export const removeOrder = createAsyncThunk('order/removeOrder', async id => {
  await remove(id);
  return getAll();
});
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    value: [],
    loading: true,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllOrder.fulfilled, (state: any, action) => {
        state.loading = false;
        state.value = action.payload;
    });
    builder.addCase(addOrder.fulfilled, (state: any, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadOrder.fulfilled, (state: any, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeOrder.fulfilled, (state: any, action) => {
      state.value = action.payload;
    });
  },
});
export default orderSlice.reducer;
