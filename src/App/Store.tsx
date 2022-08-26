import {configureStore} from '@reduxjs/toolkit';
import cateSlice from '../Features/CateSlice';
import floorSlice from '../Features/FloorSlice';
import productsSlice from '../Features/ProductsSlice';
import saveOrderSlice from '../Features/SaveOrderSlice';
import tableSlice from '../Features/TableSlice';
import dataAllSlice from '../Features/DataAll';
import orderSlice from '../Features/OrderSlice';
import checkSaveOrderSlice from '../Features/CheckSaveOrder';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    categoris: cateSlice,
    floors: floorSlice,
    tables: tableSlice,
    saveorders: saveOrderSlice,
    dataAll: dataAllSlice,
    orders: orderSlice,
    checkSaveOrder: checkSaveOrderSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
