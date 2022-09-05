import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import SaveorderAPI, {
  add,
  upload,
  remove,
  updateFind,
  removes,
} from './../API/SaveOrder';
async function getAll() {
  const {data: saveorders} = await SaveorderAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataSaveOrder: any = [];
  saveorders?.filter((item: any) => {
    if (item.id_user == user.data._id) {
      dataSaveOrder.push(item);
    }
  });

  return dataSaveOrder;
}
export const getAllSaveOrder = createAsyncThunk(
  'saveOrder/getAll',
  async () => {
    return getAll();
  },
);
export const addSaveOrder = createAsyncThunk(
  'saveorder/addSaveOrder',
  async (data: any) => {
    const {data: saveorders} = await add(data);
    return saveorders;
  },
);
export const uploadSaveOrder = createAsyncThunk(
  'saveorder/uploadSaveOrder',
  async (data: any) => {
    const {data: saveorders} = await upload(data.id, data.data);
    return saveorders;
  },
);
export const removeSaveOrder = createAsyncThunk(
  'saveorder/removeSaveOrder',
  async (id: any) => {
    const {data: saveorders} = await remove(id);
    return saveorders;
  },
);
export const uploadSaveOrderFind = createAsyncThunk(
  'saveorder/uploadSaveOrderFind',
  async (data: any) => {
    const {data: saveorders} = await updateFind(data.id, data.data);
    return saveorders;
  },
);
export const removeSaveOrderAll = createAsyncThunk(
  'saveorder/removeSaveOrderAll',
  async (data: any) => {
    for (let i = 0; i < data.length; i++) {
      await remove(data[i]);
    }
    return getAll();
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
    builder.addCase(addSaveOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(uploadSaveOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(removeSaveOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(removeSaveOrderAll.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
    builder.addCase(
      uploadSaveOrderFind.fulfilled,
      (state: any, action: any) => {
        state.value = action.payload;
      },
    );
  },
});
export default saveOrderSlice.reducer;
