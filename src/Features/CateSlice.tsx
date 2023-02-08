import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CateAPI, { add, remove, upload } from "../API/CateAPI";
async function getAll() {
  const { data: categoris } = await CateAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataCategoris:any = [];
  categoris?.filter((item:any) => {
    if (item.user_id == user.data._id) {
      dataCategoris.push(item);
    }
  });

  return dataCategoris;
}
export const getCategori = createAsyncThunk(
  "categori/getCategori",
  async () => {
    return getAll();
  }
);
export const addCategori = createAsyncThunk(
  "categori/addCategori",
  async (data) => {
    await add(data);
    return getAll();
  }
);
export const removeCategori = createAsyncThunk(
  "categori/removeCategori",
  async (data) => {
    await remove(data);
    return getAll();
  }
);
export const uploadCategori = createAsyncThunk(
  "categori/uploadCategori",
  async (data:any) => {
    await upload(data.id, data.data);
    return getAll();
  }
);
const cateSlice = createSlice({
  name: "categori",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategori.fulfilled, (state:any, action:any) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    }),
      builder.addCase(removeCategori.fulfilled, (state:any, action:any) => {
        state.value = action.payload;
      });
    builder.addCase(uploadCategori.fulfilled, (state:any, action:any) => {
      state.value = action.payload;
    });
  },
});
export default cateSlice.reducer;
