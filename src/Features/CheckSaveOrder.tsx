import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import SaveorderAPI from '../API/SaveOrder';
import TableAPI from '../API/TableAPI';
export const getCheckSaveOrder = createAsyncThunk(
  'check/getCheckSaveOrder',
  async () => {
    const logStorage: any = await AsyncStorage.getItem('user');
    const user = JSON.parse(logStorage);

    const {data: saveorders} = await SaveorderAPI.getAll();
    const dataSaveOrder: any = [];
    saveorders?.filter((item: any) => {
      if (item.id_user == user.data._id) {
        dataSaveOrder.push(item);
      }
    });

    const {data: tables} = await TableAPI.getAll();
    const dataTable: any = [];
    for (let i = 0; i < tables.length; i++) {
      if (tables[i].user_id == user.data._id) {
        dataTable.push(tables[i]);
      }
    }
    let arr: any = [];
    dataTable.map((element: any) => {
      let arrFilter = dataSaveOrder.filter((e: any) => {
        return e.id_table === element._id;
      });
      arr.push({_id: element._id, data: arrFilter, sum: 0});
    });
    // let arr1: any = [];
    // dataTable.map((element: any) => {
    //   dataSaveOrder.map((e: any) => {
    //     let arrFilter: any = [];
    //     if (e.id_table === element._id) {
    //       if (e.weight !== undefined) {
    //         const tien = e.price * e.weight;
    //         arrFilter.push(tien * e.amount);
    //       } else {
    //         console.log(e.price * e.amount, 'chào nhé');
    //         arrFilter.push(e.price * e.amount);
    //       }
    //     }
    //     arr1.push({_id: element._id, data: arrFilter, sum: arrFilter});
    //   });
    // });
    // console.log(arr1, '2343rewds');

    return arr;
  },
);
const checkSaveOrderSlice = createSlice({
  name: 'check',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(getCheckSaveOrder.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    });
  },
});
export default checkSaveOrderSlice.reducer;
