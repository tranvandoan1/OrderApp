import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ListPro from './ListPro';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAllSaveOrder, removeSaveOrder} from '../Features/SaveOrderSlice';
import {uploadSaveOrderFind} from './../Features/SaveOrderSlice';
import {getAllPro} from './../Features/ProductsSlice';
import ModalPay from '../Modal/ModalPay';
import ModalCheckPay from './../Modal/ModalCheckPay';
import {getCheckSaveOrder} from './../Features/CheckSaveOrder';
type Props = {
  route: any;
  navigation: any;
};
const Order = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  const products = useAppSelect((data: any) => data.products.value);
  const newOrder = saveorders?.filter(
    (item: any) =>
      item.floor_id == props.route.params.floor_id &&
      item.id_table == props.route.params.id_table,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<any>();
  const [valueAmount, setValueMount] = useState<any>();
  const [valueSale, setValueSale] = useState<any>();
  const [checkPayy, setCheckPayy] = useState<boolean>(false);
  const [payy, setPayy] = useState<boolean>(false);
  const [valueName, setValueName] = useState<any>();
  const [id, setId] = useState<any>();
  const checkSaveOrder = useAppSelect((data: any) => data.checkSaveOrder.value);
  useEffect(() => {
    dispatch(getAllSaveOrder());
    dispatch(getAllPro());
    dispatch(getCheckSaveOrder());
  }, []);
  // tính tổng tiền
  const prices = newOrder.map((item: any) => {
    if (item.weight) {
      return Math.ceil(+item.price * item.weight * +item.amount);
    } else {
      return Math.ceil(+item.price * +item.amount);
    }
  });
  let sum = 0;
  for (var i = 0; i < prices.length; i++) {
    sum += +prices[i];
  }

  const onSubmit = async (itemm: any) => {
    const findSaveOrder = saveorders.find(
      (item: any) => item._id == itemm.data._id,
    );
    if (
      (findSaveOrder.amount >= 1 && itemm.check == 'add') ||
      (findSaveOrder.amount > 1 && itemm.check == 'decrease')
    ) {
      const upSaveOrder = {
        amount:
          itemm.check == 'add'
            ? +findSaveOrder.amount + +1
            : +findSaveOrder.amount - +1,
      };
      setLoading(true);
      await dispatch(
        uploadSaveOrderFind({id: itemm.data._id, data: upSaveOrder}),
      );
      setLoading(false);
    } else if (findSaveOrder.amount <= 1 && itemm.check == 'decrease') {
      setLoading(true);
      await dispatch(removeSaveOrder(itemm.data._id));
      setLoading(false);
    }
  };
  const uploadAmount = async (item: any) => {
    const uploadSaveOrder = {
      amount:
        valueAmount == undefined || String(value).length <= 0
          ? item.amount
          : valueAmount,
    };
    setLoading(true);
    setValueMount(undefined);
    await dispatch(uploadSaveOrderFind({id: item._id, data: uploadSaveOrder}));
    setLoading(false);
  };

  const deleteOrder = async (id: any) => {
    setLoading(true);
    setValueMount(undefined);
    await dispatch(removeSaveOrder(id));
    setLoading(false);
  };
  console.log(checkSaveOrder,'eqwdas')
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        position: 'relative',
        width: '100%',
        alignItems: 'center',
      }}>
      {loading == true && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      )}
      <View style={{width: '65%'}}>
        <ListPro
          loading={(e: any) => setLoading(e)}
          id={props.route.params}
          navigation={() =>
            props.navigation?.navigate('Home', {data: checkSaveOrder})
          }
        />
      </View>

      <View style={styles.right}>
        <Text style={styles.proOrder}>Sản phẩm đã chọn</Text>

        <View style={{padding: 5, height: 450}}>
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              {newOrder.length <= 0 ? (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 25,
                    }}>
                    Chưa có sản phẩm
                  </Text>
                </View>
              ) : products.length <= 0 ? (
                <View style={styles.loading1}>
                  <ActivityIndicator size="large" color={'blue'} />
                </View>
              ) : (
                newOrder?.map((item: any, index: any) => {
                  return (
                    <View
                      style={[
                        styles.listOrder,
                        newOrder.length - 1 !== index && {borderBottomWidth: 1},
                      ]}
                      key={index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '70%',
                          overflow: 'hidden',
                        }}>
                        <TouchableOpacity onPress={() => deleteOrder(item._id)}>
                          <AntDesign
                            name="closecircle"
                            color={'tomato'}
                            size={22}
                            style={{marginRight: 5}}
                          />
                        </TouchableOpacity>

                        <Text style={styles.stt}>{index + 1}</Text>
                        <View style={{flexDirection: 'column'}}>
                          <Text style={styles.proname} numberOfLines={2}>
                            {item.name}
                          </Text>
                          {item.weight && <Text>{item.weight}kg</Text>}
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '30%',
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            onSubmit({data: item, check: 'decrease'})
                          }>
                          <Entypo
                            name="circle-with-minus"
                            color={'#FF6633'}
                            size={30}
                          />
                        </TouchableOpacity>
                        <TextInput
                          value={`${
                            valueAmount == undefined
                              ? item.amount
                              : item._id == id
                              ? valueAmount
                              : item.amount
                          }`}
                          style={styles.text}
                          keyboardType="numeric"
                          onChangeText={e => setValueMount(e)}
                          onBlur={() => uploadAmount(item)}
                          onPressIn={() => setId(item._id)}
                        />
                        <TouchableOpacity
                          onPress={() => onSubmit({data: item, check: 'add'})}>
                          <AntDesign
                            name="pluscircle"
                            color={'#FF6633'}
                            size={25}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
        <View style={styles.bott}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              paddingHorizontal: 5,
              justifyContent: 'space-between',
            }}>
            <TextInput
              value={value}
              onChangeText={e => setValue(e)}
              placeholder="Nhập mã giảm giá"
              keyboardType="number-pad"
              style={{
                borderWidth: 1,
                borderColor: '#EEEEEE',
                fontSize: 15,
                flex: 1,
                paddingLeft: 5,
                paddingVertical: 0,
              }}
            />
            <TouchableOpacity
              onPress={() => (setValueSale(value), setValue(undefined))}>
              <Text style={styles.xn}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View
              style={
                valueSale !== undefined &&
                valueSale !== 0 &&
                String(valueSale).length > 1 && {
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }
              }>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  },
                  valueSale !== undefined &&
                    valueSale !== 0 &&
                    String(valueSale).length > 1 && {
                      paddingRight: 10,
                      borderColor: 'rgb(219,219,219)',
                      borderRightWidth: 0.5,
                    },
                ]}>
                <View style={styles.flex}>
                  <Text
                    style={[
                      styles.price,
                      valueSale == undefined && {fontSize: 18},
                    ]}>
                    Tổng tiền :{' '}
                  </Text>
                  {valueSale !== undefined &&
                    valueSale !== 0 &&
                    String(valueSale).length > 1 && (
                      <Text style={[styles.price, {marginVertical: 10}]}>
                        Giảm giá :{' '}
                      </Text>
                    )}
                </View>
                <View>
                  <Text
                    style={[
                      styles.priceRed,
                      valueSale == undefined && {fontSize: 25},
                    ]}>
                    {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                  </Text>
                  {valueSale !== undefined &&
                    valueSale !== 0 &&
                    String(valueSale).length > 1 && (
                      <Text style={[styles.priceRed, {marginVertical: 10}]}>
                        -{valueSale}%
                      </Text>
                    )}
                </View>
              </View>
              {valueSale !== undefined &&
                valueSale !== 0 &&
                String(valueSale).length > 1 && (
                  <View
                    style={[
                      {
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        flex: 1,
                      },
                    ]}>
                    <Text style={[styles.price, {fontSize: 18}]}>
                      Tổng tiền thanh toán
                    </Text>
                    <Text style={[styles.priceRed, {fontSize: 25}]}>
                      {Math.ceil(sum * ((100 - valueSale) / 100))
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      đ
                    </Text>
                  </View>
                )}
            </View>

            <TouchableOpacity onPress={() => setCheckPayy(true)}>
              <Text style={styles.tt}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {newOrder?.length > 0 && checkPayy == true ? (
        <ModalCheckPay
          checkPay={checkPayy}
          hiidenCheckPay={(e: any) => (
            setCheckPayy(false), setPayy(e.check), setValueName(e.name)
          )}
          valueSale={valueSale}
          idTableFloor={props.route.params}
          saveorders={newOrder}
          sum={sum}
        />
      ) : null}
      {newOrder?.length > 0 && payy == true && (
        <ModalPay
          payy={payy}
          hiidenPay={() => (setCheckPayy(false), setPayy(false))}
          valueSale={valueSale}
          valueName={valueName}
          idTableFloor={props.route.params}
          saveorders={newOrder}
          sum={sum}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Order;

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bott: {
    width: '100%',
    borderColor: 'black',
    borderTopWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  right: {
    width: '35%',
    backgroundColor: '#fff',
    borderColor: '#EEEEEE',
    borderLeftWidth: 1,
    flex: 1,
    height: '100%',
  },
  proOrder: {
    color: '#fff',
    backgroundColor: 'blue',
    paddingHorizontal: 5,
    paddingVertical: 15,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500',
  },
  listOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    borderColor: 'tomato',
  },
  stt: {
    paddingVertical: 1,
    paddingHorizontal: 7,
    fontSize: 15,
    borderRadius: 20,
    textAlign: 'center',
    backgroundColor: 'tomato',
    color: '#fff',
    fontWeight: '700',
    marginRight: 10,
  },
  proname: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    textTransform: 'capitalize',
  },

  text: {
    borderColor: '#FFCC99',
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 17,
    marginHorizontal: 5,
    paddingVertical: 0,
    paddingHorizontal: 3,
    borderRadius: 100,
    color: 'black',
    fontWeight: '600',
  },
  tt: {
    width: '100%',
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: 'tomato',
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
  },
  xn: {
    borderColor: '#EEEEEE',
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: 'blue',
    borderRadius: 3,
    fontWeight: '500',
    marginLeft: 5,
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  loading1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  price: {
    textAlign: 'right',
    fontWeight: '500',
    color: 'blue',
  },
  priceRed: {
    color: 'red',
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '500',
  },
});
