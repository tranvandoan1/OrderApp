import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListTableBill from './ListTableBill';
import { Size, SizeScale } from '../../Component/size';
import moment from 'moment';
import ModalSelectDate from '../../Modal/ModalSelectDate';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../App/Store';
import { getAllOrder } from './../../Features/OrderSlice';
type Props = {
  checkUserStorage: any;
  navigation?: any;
  background: any;
  language: any;
};
const ListBill: React.FC<Props> = ({
  language,
  navigation,
  background,
  checkUserStorage,
}) => {
  const width = Size()?.width;
  const widthScale = SizeScale().width;
  const textLanguage = language?.data?.cart
  const [selectDate, setSelectDate] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const orders = useAppSelect((data: any) => data.orders);
  const monthConvert = `${String(moment().month() + 1).length == 1
    ? `0${moment().month() + 1}`
    : moment().month() + 1
    }`;
  const dateConvert = `${String(moment().date()).length == 1
    ? `0${moment().date()}`
    : moment().date()
    }`;
  useEffect(() => {
    dispatch(getAllOrder());
  }, []);
  const [data, setData] = useState<any>();
  const getOrder = () => {
    const dataProps: any = [];
    orders?.value?.map((item: any) => {
      const time: any = new Date(item.updatedAt);
      if (
        time.getDate() == dateConvert &&
        time.getMonth() + 1 == monthConvert &&
        time.getFullYear() == moment().year()
      ) {
        dataProps.push(item);
      }
    });
    // tính tổng tiền
    let sum = 0;
    for (let i = 0; i < dataProps.length; i++) {
      sum += Math.ceil(
        dataProps[i].sumPrice * ((100 - dataProps[i].sale) / 100),
      );
    }
    setData({
      sum: sum,
      data: dataProps,
      date: {
        date: dateConvert,
        month: monthConvert,
        year: moment().year(),
      },
      filter: 1,
    });
  };
  useEffect(() => {
    getOrder();
  }, [language, orders?.value]);
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              styles.titlePro,
              {
                fontSize: width < 720 ? 20 : 23,
                marginLeft: widthScale * 10
              },
            ]}>
            {textLanguage?.bills}
          </Text>
        </View>
        <View style={styles.date}>
          <View style={styles.date}>
            <Text style={{ fontSize: 22, fontWeight: '500', color: 'red' }}>
              {textLanguage?.sum}
              :{' '}
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '500', color: 'tomato' }}>
              {data?.sum?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
            </Text>
          </View>
          <TouchableOpacity onPress={() => setSelectDate(true)}>
            <TextInput
              selectTextOnFocus={false}
              editable={false}
              defaultValue={
                data?.filter == 1
                  ? data?.date?.date == moment().date() &&
                    data?.date?.month == moment().month() + 1 &&
                    data?.date?.year == moment().year()
                    ? `${textLanguage?.today}`
                    : `${data?.date?.date}-${data?.date?.month}-${data?.date?.year}`
                  : data?.filter == 2
                    ? data?.date?.month == moment().month() + 1 &&
                      data?.date?.year == moment().year()
                      ? `${textLanguage?.this_month}`
                      : `${data?.date?.month}-${data?.date?.year}`
                    : data?.date?.year == moment().year()
                      ? `${textLanguage?.this_year}`
                      : data?.date?.year
              }
              style={{
                color: 'blue',
                borderColor: 'blue',
                borderWidth: 1,
                borderRadius: 2,
                paddingHorizontal: 10,
                paddingVertical: 5,
                margin: 0,
                fontWeight: '500',
                fontSize: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* {orders?.value?.length <= 0 && orders?.loading == true ? (
        <View style={styles.loading_g}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : ( */}
      <ListTableBill orderToDay={data?.data} textLanguage={textLanguage}/>
      {/* )} */}
      {selectDate == true && (
        <ModalSelectDate
          selectDateProps={selectDate}
          hiddenSelectDate={
            (e: any) =>
              String(e).length >= 1
                ? (setData(e), setSelectDate(false))
                : setSelectDate(false)
            // console.log(e,'3e2wd')
          }
          dataOrders={orders?.value}
          textLanguage={textLanguage}
        />
      )}
    </View>
  );
};

export default ListBill;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 5,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'blue',
    borderColor: 'rgb(219,219,219)',
    borderBottomWidth: 1,
  },
  date: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titlePro: {
    fontSize: 18,
    fontWeight: '500',
    color: 'blue',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
  },
  iconBack: {
    fontSize: 20,
    color: 'blue',
    marginRight: 10,
    fontWeight: '600',
  },
  title: {
    color: 'blue',
    fontSize: 22,
    fontWeight: '500',
  },
  inputSearch: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginTop: 5,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  loading_g: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
