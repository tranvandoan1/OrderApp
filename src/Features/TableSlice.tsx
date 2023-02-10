import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import TableAPI, {
  add,
  addOrdersTable,
  remove,
  removeOrderTable,
  upload,
  uploadBookTable,
  changeTable,
} from '../API/TableAPI';

async function tableAll() {
  const {data: tables} = await TableAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataTable = [];
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].user_id == user.data._id) {
      tables[i].name = tables[i].name.replace(/[^0-9]/g, '');
      dataTable.push(tables[i]);
    }
  }

  dataTable.sort((a, b) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataTable.length; i++) {
    dataTable[i].name = `Bàn ${dataTable[i].name}`;
    dataTable[i].orders =
      dataTable[i].orders == null ? null : JSON.parse(dataTable[i].orders);
  }

  return dataTable;
}
export const getAllTable = createAsyncThunk('table/getAllTable', async () => {
  return tableAll();
});

export const addTable = createAsyncThunk('table/addTable', async (data) => {
  await add(data);
  return tableAll();
});

export const addOrderTable = createAsyncThunk(
  'table/addOrderTable',
  async data => {
    await addOrdersTable(data);
    return tableAll();
  },
);
export const editBookTable = createAsyncThunk(
  'table/editBookTable',
  async data => {
    await uploadBookTable(data);
    return tableAll();
  },
);
export const removeOrder = createAsyncThunk(
  'table/removeOrder',
  async id => {
    await removeOrderTable(id);
    return tableAll();
  },
);
export const removeTable = createAsyncThunk('table/removeTable', async (id) => {
  await remove(id);
  return tableAll();
});
export const editTable = createAsyncThunk('table/editTable', async (data:any) => {
  await upload(data.id, data.data);
  return tableAll();
});

export const changeTables = createAsyncThunk(
  'saveorder/changeTables',
  async data => {
    await changeTable(data);
    return tableAll();
  },
);
export const cancelTable = createAsyncThunk(
  'saveorder/cancelTable',
  async data => {
    await removeOrderTable(data);
    return tableAll();
  },
);

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    value: [],
    loading: true,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllTable.fulfilled, (state:any, action) => {
      // if (action.payload.length <= 0) {
      //   state.checkData = true;
      // }
        state.loading = false;
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

    builder.addCase(addOrderTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(changeTables.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(cancelTable.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
    builder.addCase(removeOrder.fulfilled, (state:any, action) => {
      state.value = action.payload;
    });
  },
});
export default tableSlice.reducer;
