import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import CateAPI from '../API/CateAPI';
import FloorAPI from '../API/FloorAPI';
import ProAPI from '../API/ProAPI';
import SaveorderAPI from '../API/SaveOrder';
import TableAPI from '../API/TableAPI';
export const getAllData = createAsyncThunk('dataAll/getAllData', async () => {
  const {data: categoris} = await CateAPI.getAll();
  const logStorage: any = await AsyncStorage.getItem('user');
  const user = JSON.parse(logStorage);
  const dataCate: any = [];
  for (let i = 0; i < categoris.length; i++) {
    if (categoris[i].user_id == user.data._id) {
      dataCate.push(categoris[i]);
    }
  }
  const {data: saveorders} = await SaveorderAPI.getAll();
  const dataSaveOrder: any = [];
  saveorders?.filter((item: any) => {
    if (item.id_user == user.data._id) {
      dataSaveOrder.push(item);
    }
  });

  const {data: products} = await ProAPI.getAll();
  const dataPro: any = [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].user_id == user.data._id) {
      dataPro.push(products[i]);
    }
  }

  const {data: tables} = await TableAPI.getAll();
  const dataTable: any = [];
  const newData: any = [];
  for (let i = 0; i < tables.length; i++) {
    if (tables[i].user_id == user.data._id) {
      tables[i].name = tables[i].name.replace(/[^0-9]/g, '');
      dataTable.push(tables[i]);
    }
  }

  dataTable.sort((a: any, b: any) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataTable.length; i++) {
    dataTable[i].name = `Bàn ${dataTable[i].name}`;
    newData.push(dataTable[i]);
  }

  const {data: floors} = await FloorAPI.getAll();
  const dataFloor: any = [];
  const newData1: any = [];
  for (let i = 0; i < floors.length; i++) {
    if (floors[i].user_id == user.data._id) {
      floors[i].name = floors[i].name.replace(/[^0-9]/g, '');
      dataFloor.push(floors[i]);
    }
  }

  dataFloor.sort((a: any, b: any) => {
    return a.name - b.name;
  });

  for (let i = 0; i < dataFloor.length; i++) {
    dataFloor[i].name = `Tầng ${dataFloor[i].name}`;
    newData1.push(dataFloor[i]);
  }

  const dataAll = {
    products: dataPro,
    categoris: dataCate,
    tables: newData,
    floors: newData1,
  };

  return dataAll;
});
const dataAllSlice = createSlice({
  name: 'dataAll',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getAllData.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default dataAllSlice.reducer;
