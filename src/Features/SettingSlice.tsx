import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import CateAPI, {add, remove, upload} from '../API/CateAPI';
import {dataEs, dataVn} from './../assets/language/language';

const getBackgroundLoca = async () => {
  const backgroundLoca = await AsyncStorage.getItem('background');
  const languageLoca: any = await AsyncStorage.getItem('language');
  console.log(languageLoca, 'languageLoca');
  if (backgroundLoca == null && languageLoca == null) {
    return {data: dataVn, background: 1, language: 'vn'};
  } else if (backgroundLoca == null && languageLoca !== null) {
    return {
      data: JSON.parse(languageLoca) == 'vn' ? dataVn : dataEs,
      background: 1,
      language: JSON.parse(languageLoca),
    };
  } else if (backgroundLoca !== null && languageLoca == null) {
    return {data: dataVn, background: backgroundLoca, language: 'vn'};
  } else {
    return {
      data: languageLoca == 'es' ? dataEs : dataVn,
      background: backgroundLoca,
      language: JSON.parse(languageLoca),
    };
  }
};
export const getData = createAsyncThunk('background/getData', async data => {
  return getBackgroundLoca();
});
export const uploadBackground = createAsyncThunk(
  'background/uploadBackground',
  async data => {
    console.log(data, '32ewdsew');
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
      builder.addCase(uploadBackground.fulfilled, (state: any, action: any) => {
        state.value = action.payload;
      });
  },
});
export default settingSlice.reducer;
