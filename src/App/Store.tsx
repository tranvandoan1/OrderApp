import {configureStore} from '@reduxjs/toolkit';
import productsSlice from '../Features/ProductsSlice';
import tableSlice from '../Features/TableSlice';
import orderSlice from '../Features/OrderSlice';
import userSlice from '../Features/UserSlice';
import settingSlice from './../Features/SettingSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    tables: tableSlice,
    orders: orderSlice,
    users: userSlice,
    setting: settingSlice,
    
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
