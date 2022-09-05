import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import OrderAPI, {add, remove, upload} from '../API/Order';
export const getAllOrder = createAsyncThunk('order/getAllOrder', async () => {
  const {data: orders} = await OrderAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataOrder: any = [];
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].user_id == user.data._id) {
      await dataOrder.push(orders[i]);
    }
  }

  return dataOrder;
});
export const addOrder = createAsyncThunk(
  'order/addOrder',
  async (data: any) => {
    const {data: orders} = await add(data);
    return orders;
  },
);
export const uploadOrder = createAsyncThunk(
  'order/uploadOrder',
  async (data: any) => {
    const {data: orders} = await upload(data.id, data.data);
    return orders;
  },
);
export const removeOrder = createAsyncThunk(
  'order/removeOrder',
  async (id: any) => {
    const {data: orders} = await remove(id);
    return orders;
  },
);
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAllOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(addOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(uploadOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(removeOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default orderSlice.reducer;
