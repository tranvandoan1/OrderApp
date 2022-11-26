import {configureStore} from '@reduxjs/toolkit';
import cateSlice from '../Features/CateSlice';
import productsSlice from '../Features/ProductsSlice';
import saveOrderSlice from '../Features/SaveOrderSlice';
import tableSlice from '../Features/TableSlice';
import dataAllSlice from '../Features/DataAll';
import orderSlice from '../Features/OrderSlice';
import userSlice from '../Features/UserSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    categoris: cateSlice,
    tables: tableSlice,
    saveorders: saveOrderSlice,
    dataAll: dataAllSlice,
    orders: orderSlice,
    users: userSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
