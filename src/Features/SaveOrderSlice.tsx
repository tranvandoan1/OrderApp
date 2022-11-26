import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SaveorderAPI, {
  add,
  upload,
  remove,
  updateFind,
  removes,
  changeTable,
} from "../API/SaveOrder";
async function getAll() {
  const { data: saveorders } = await SaveorderAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataSaveOrder:any = [];
  saveorders?.filter((item:any) => {
    if (item.id_user == user.data._id) {
      dataSaveOrder.push(item);
    }
  });

  return dataSaveOrder;
}
export const getAllSaveOrder = createAsyncThunk(
  "saveOrder/getAll",
  async () => {
    return getAll();
  }
);
export const addSaveOrder = createAsyncThunk(
  "saveorder/addSaveOrder",
  async (data) => {
    await add(data);
    return getAll();
  }
);
export const uploadSaveOrder = createAsyncThunk(
  "saveorder/uploadSaveOrder",
  async (data:any) => {
    await upload(data.id, data.data);
    return getAll();
  }
);
export const removeSaveOrder = createAsyncThunk(
  "saveorder/removeSaveOrder",
  async (id) => {
    await remove(id);
    return getAll();
  }
);
export const uploadSaveOrderFind = createAsyncThunk(
  "saveorder/uploadSaveOrderFind",
  async (data:any) => {
    await updateFind(data.id, data.data);
    return getAll();
  }
);
export const removeSaveOrderAll = createAsyncThunk(
  "saveorder/removeSaveOrderAll",
  async (data) => {
    await removes(data);
    return getAll();
  }
);
export const changeTables = createAsyncThunk(
  "saveorder/changeTables",
  async (data) => {
    await changeTable(data);

    return getAll();
  }
);
const saveOrderSlice = createSlice({
  name: "table",
  initialState: {
    value: [],
    checkData: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSaveOrder.fulfilled, (state:any, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(addSaveOrder.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadSaveOrder.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeSaveOrder.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeSaveOrderAll.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(uploadSaveOrderFind.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(changeTables.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
  },
});
export default saveOrderSlice.reducer;
