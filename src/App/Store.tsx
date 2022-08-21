import {configureStore} from '@reduxjs/toolkit';
import cateSlice from '../Features/CateSlice';
import floorSlice from '../Features/FloorSlice';
import productsSlice from '../Features/ProductsSlice';
import saveOrderSlice from '../Features/SaveOrderSlice';
import tableSlice from '../Features/TableSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    categoris: cateSlice,
    floors: floorSlice,
    tables: tableSlice,
    saveorders: saveOrderSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
