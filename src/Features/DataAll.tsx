import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CateAPI from "../API/CateAPI";
import OrderAPI from "../API/Order";
import TableAPI from "../API/TableAPI";
import ProAPI from "../API/ProAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAll = createAsyncThunk("all/getAll", async () => {
  const { data: products } = await ProAPI.getAll();
  const { data: categoris } = await CateAPI.getAll();
  const { data: orders } = await OrderAPI.getAll();
  const { data: tables } = await TableAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);

  function getAll(data:any) {
    const newData:any = [];
    data?.filter((item:any) => {
      if (item.user_id == user.data._id) {
        newData.push(item);
      }
    });
    return newData;
  }

  const allData = {
    products: getAll(products),
    categoris: getAll(categoris),
    orders: getAll(orders),
    tables: getAll(tables),
  };
  return allData;
});

const dataAllSlice = createSlice({
  name: "allData",
  initialState: {
    value: {},
  },
  reducers:{},
  extraReducers: (builder) => {
    builder.addCase(getAll.fulfilled, (state:any, action:any) => {
      state.value = action.payload;
    });
  },
});
export default dataAllSlice.reducer;
