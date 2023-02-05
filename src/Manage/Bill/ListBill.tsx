import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListTableBill from './ListTableBill';
import { Size } from '../../Component/size';
import moment from 'moment';
import ModalSelectDate from '../../Modal/ModalSelectDate';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../App/Store';
import { getAllOrder } from './../../Features/OrderSlice';
const ListBill = ({ navigation }: any) => {
  const width = Size()?.width;
  const [selectDate, setSelectDate] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>()
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const orders = useAppSelect((data: any) => data.orders.value);
  useEffect(() => {
    dispatch(getAllOrder())
  }, [])
  const [date, setDate] = useState<any>({
    date:
      String(moment().date()).length == 1
        ? `0${moment().date()}`
        : moment().date(),
    month:
      String(moment().month() + 1).length == 1
        ? `0${moment().month() + 1}`
        : moment().month() + 1,
    year: moment().year(),
  });
  // lọc order
  const orderToDay = orders?.filter((item: any) => {
    console.log(item, 'đáasdasd')
    const time = new Date(item.createdAt);
    if (
      time.getFullYear() == date.year &&
      (String(time.getMonth() + 1).length <= 1 ? `0${time.getMonth() + 1}` : time.getMonth() + 1) == date.month &&
      (String(time.getDate()).length <= 1 ? `0${time.getDate()}` : time.getDate()) == date.date
    ) {
      return item;
    }
  });
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('manage')}>
            <AntDesign name="left" style={styles.iconBack} />
          </TouchableOpacity>
          <Text
            style={[
              styles.titlePro,
              {
                fontSize: width < 720 ? 20 : 23,
              },
            ]}>
            Hóa đơn
          </Text>
        </View>
        <View style={styles.date}>
          <TouchableOpacity onPress={() => setSelectDate(true)}>

            <TextInput
              selectTextOnFocus={false}
              editable={false}
              defaultValue={
                (((String(moment().date()).length == 1
                  ? `0${moment().date()}`
                  : moment().date()) == date.date) &&
                  ((String(moment().month() + 1).length == 1
                    ? `0${moment().month() + 1}`
                    : moment().month() + 1) == date.month) &&
                  (moment().year() == date.year)) ? 'Hôm nay' :
                  `${date.date}/${date.month}/${date.year}`
              }
              style={{
                color: '#fff',
                borderColor: '#fff',
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

      <ListTableBill
        orderToDay={orderToDay}
      />
      <ModalSelectDate
        selectDate={selectDate}
        hiddenSelectDate={(e: any) =>
          String(e).length >= 1
            ? (setDate(e), setSelectDate(false))
            : setSelectDate(false)
        }
      />
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
    backgroundColor: 'blue',
    borderColor: 'rgb(219,219,219)',
    borderBottomWidth: 1,
  },
  date: {
    padding: 10,
  },
  titlePro: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    fontFamily: Platform.OS == 'android' ? 'Roboto-Light' : 'Roboto-Bold',
    fontStyle: 'normal',
  },
  iconBack: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
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
});
