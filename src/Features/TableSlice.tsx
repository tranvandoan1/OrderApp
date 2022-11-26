import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TableAPI, {
  add,
  remove,
  upload,
  uploadBookTable,
  uploadMoveTable,
} from "../API/TableAPI";

async function tableAll() {
  const { data: tables } = await TableAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataTable = [];
  const newData = [];
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].user_id == user.data._id) {
      tables[i].name = tables[i].name.replace(/[^0-9]/g, "");
      dataTable.push(tables[i]);
    }
  }

  dataTable.sort((a, b) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataTable.length; i++) {
    dataTable[i].name = `Bàn ${dataTable[i].name}`;
    newData.push(dataTable[i]);
  }
  
  return newData;
}
export const getAllTable = createAsyncThunk("table/getAllTable", async () => {
  return tableAll();
});

export const addTable = createAsyncThunk("table/addTable", async (data) => {
  await add(data);
  return tableAll();
});
export const editBookTable = createAsyncThunk(
  "table/editBookTable",
  async (data) => {
    await uploadBookTable(data);
    return tableAll();
  }
);
export const removeTable = createAsyncThunk("table/removeTable", async (id) => {
  await remove(id);
  return tableAll();
});
export const editTable = createAsyncThunk("table/editTable", async (data:any) => {
  await upload(data.id, data.data);
  return tableAll();
});
export const editMoveTable = createAsyncThunk(
  "table/editMoveTable",
  async (data) => {
    await uploadMoveTable(data);
    return tableAll();
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState: {
    value: [],
    checkData: false,

  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTable.fulfilled, (state:any, action) => {
      if (action.payload.length <= 0) {
        state.checkData = true;
      }
      state.value = action.payload;
    });
    builder.addCase(addTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(editTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(editBookTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(editMoveTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });

  },
});
export default tableSlice.reducer;
