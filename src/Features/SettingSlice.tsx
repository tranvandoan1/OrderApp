import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CateAPI, { add, remove, upload } from '../API/CateAPI';
import { dataEs, dataVn } from './../assets/language/language';

const getBackgroundLoca = async () => {
  const backgroundLoca = await AsyncStorage.getItem('background');
  const languageLoca: any = await AsyncStorage.getItem('language');
  return {
    data: languageLoca == undefined ? dataVn : JSON.parse(languageLoca) == 'es' ? dataEs : dataVn,
    background: backgroundLoca == undefined ? 1 : backgroundLoca,
    language: languageLoca == undefined ? 'vn' : JSON.parse(languageLoca),
  };
  // }
};
export const getData = createAsyncThunk('background/getData', async data => {
  return getBackgroundLoca();
});
export const uploadSetting = createAsyncThunk(
  'background/uploadSetting',
  async data => {
    return data;
  },
);
const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    value: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state: any, action: any) => {
      state.value = action.payload;
    }),
      builder.addCase(uploadSetting.fulfilled, (state: any, action: any) => {
        state.value = action.payload;
      });
  },
});
export default settingSlice.reducer;
