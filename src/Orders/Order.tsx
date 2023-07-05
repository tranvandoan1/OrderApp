import {
  ActivityIndicator,
  Pressable,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import React, {
  startTransition,
  useEffect,
  useReducer,
  useState,
} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ListPro from './ListPro';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../App/Store';
import { getProductAll } from '../Features/ProductsSlice';
import ModalCheckPay from '../Modal/ModalCheckPay';
import { Size, SizeScale } from '../Component/size';
import { addOrderTable, getAllTable } from '../Features/TableSlice';
import { removeOrder } from '../Features/TableSlice';
import { add } from '../API/Order';
import ShowInfoBookTable from './ShowInfoBookTable';
import ListOrderMobile from './ListOrderMobile';
type Props = {
  route: any;
  navigation: any;
};
type State = {
  loading: boolean;
  value: string | undefined;
  valueAmount: any | undefined;
  valueSale: any;
  checkPayy: boolean;
  checkAnimated: boolean;
  valueCate: any;
  showInforBookTable: boolean;
  timeStartOrder: string | undefined;
  tableOrder: any;
  selectModalCate: boolean;
};
const Order = (props: Props) => {
  const width = Size().width;
  const widthScale = SizeScale().width;
  const dispatch = useDispatch<AppDispatch>();
  const propParams = props?.route?.params;
  const [checkAnimated, setCheckAnimated] = useState<boolean>(false);

  const [state, setState] = useReducer(
    (state: State, newState: Partial<State>) => ({
      ...state,
      ...newState,
    }),
    {
      loading: false,
      value: undefined, //lấy value khi nhập mã giảm giá
      valueAmount: { value: undefined, id: null }, //lấy số lượng khi nhập số lượng
      valueSale: undefined, //lấy giá trị giảm giá khi ấn áp dụng
      checkPayy: false,
      checkAnimated: false,
      valueCate: undefined,
      showInforBookTable: false,
      timeStartOrder: undefined,
      tableOrder: propParams?.table?.orders,
      selectModalCate: false,
    },
  );
  useEffect(() => {
    dispatch(getProductAll());
  }, []);
  // tính tổng tiền
  const prices = state?.tableOrder?.map((item: any) => {
    if (item?.weight) {
      return Math.ceil(+item?.price * item?.weight * +item?.amount);
    } else {
      return Math.ceil(+item?.price * +item?.amount);
    }
  });
  let sum = 0;
  for (var i = 0; i < prices?.length; i++) {
    sum += +prices[i];
  }
  // xóa món ăn
  const deleteOrder = async (id: any) => {
    const dataNew = state?.tableOrder?.filter((item: any) => item.id !== id);
    setState({
      loading: true,
      valueAmount: { id: null, value: undefined },
      tableOrder: dataNew,
    });
    setState({ loading: false });
  };
  // thêm bớt món ăn
  const onSubmit = async (itemm: any) => {
    width < 960 && setState({ loading: true });
    const dataOrder = state?.tableOrder?.find(
      (item: any) => item.id == itemm.data.id,
    );
    if (
      (dataOrder.amount >= 1 && itemm.check == 'add') ||
      (dataOrder.amount > 1 && itemm.check == 'decrease')
    ) {
      const dataNew: any = [];
      state?.tableOrder?.map((itemOrder: any) => {
        if (itemOrder.id == itemm.data.id) {
          dataNew.push({
            ...itemOrder,
            amount:
              itemm.check == 'add'
                ? +dataOrder.amount + +1
                : +dataOrder.amount - +1,
          });
        } else {
          dataNew.push(itemOrder);
        }
      });
      setState({ loading: true, tableOrder: dataNew });
      setState({ loading: false });
    } else if (dataOrder.amount <= 1 && itemm.check == 'decrease') {
      deleteOrder(itemm.data.id);
    }
    width < 960 && setState({ loading: false });
  };
  const uploadAmount = async (item: any) => {
    // @ts-ignore
    const dataNew: any = [];
    state?.tableOrder?.map((itemOrder: any) => {
      if (itemOrder.id == item.id) {
        dataNew.push({
          ...itemOrder,
          amount:
            state?.valueAmount?.value == undefined
              ? item.amount
              : state?.valueAmount?.value,
        });
      } else {
        dataNew.push(itemOrder);
      }
    });

    setState({
      loading: true,
      valueAmount: { id: null, value: undefined },
      tableOrder: dataNew,
    });
    setState({ loading: false });
  };

  // lưu lại những món ăn vừa order khi tắt ứng dụng
  AppState.addEventListener('change', async e => {
    if (
      (JSON.stringify(state?.tableOrder) ==
        JSON.stringify(propParams?.table?.orders)) ==
      false
    ) {
      await dispatch(
        // @ts-ignore
        addOrderTable({
          data: state?.tableOrder,
          id_table: propParams?.table._id,
          time_start: state?.timeStartOrder,
        }),
      );
      setState({ tableOrder: [] });
    }
  });
  const handle = async (e: any) => {
    if (e !== 0) {
      props.navigation?.navigate('home', {
        loading: true,
        id_table: propParams?.table?._id,
        pay: true
      });
      ToastAndroid.show(`Thanh toán thành công`, ToastAndroid.SHORT);
      setTimeout(async () => {
        // @ts-ignore
        await dispatch(removeOrder({ id: e?.table_id }));
        props.navigation?.navigate('home', {
          loading: false,
          id_table: propParams?.table?._id,
          pay: false
        });
        // @ts-ignore
        await add(e);
      }, 1000);
    } else {
      setState({ checkPayy: false });
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        width: '100%',
      }}>
      {/* <StatusBar hidden={true} /> */}

      {checkAnimated == true && (
        <Pressable
          onPress={() => setCheckAnimated(false)}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.4)',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}></Pressable>
      )}

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'blue',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '10%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'blue',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width < 960 ? '100%' : '65%',
          }}>
          <View style={[styles.header, { width: '50%' }]}>
            <TouchableOpacity
              onPress={async () => {
                if (
                  (JSON.stringify(state?.tableOrder) ==
                    JSON.stringify(propParams?.table?.orders)) ==
                  false
                ) {
                  props.navigation?.navigate('home', {
                    data: state?.tableOrder,
                    id_table: propParams?.table._id,
                    time_start: state?.timeStartOrder,
                  });
                  await dispatch(
                    // @ts-ignore
                    addOrderTable({
                      data: state?.tableOrder,
                      id_table: propParams?.table._id,
                      time_start: state?.timeStartOrder,
                    }),
                  );
                  setState({ tableOrder: [] });
                } else {
                  props.navigation?.navigate('home');
                }
              }}>
              <AntDesign
                name="left"
                size={width < 960 ? 30 : 23}
                color={'#fff'}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: width < 960 ? 28 : 20,
                color: '#fff',
                marginLeft: 10,
                fontWeight: '500',
              }}>
              {propParams?.table.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '50%',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => setState({ selectModalCate: true })}>
              <View
                style={{
                  position: 'relative',
                  width: width < 960 ? 300 : 250,
                  // borderColor: 'b',
                  borderWidth: 1,
                  marginRight: 15,
                  borderRadius: 3,
                  backgroundColor: '#fff',
                }}>
                <TextInput
                  value={
                    state?.valueCate == undefined ||
                      String(state?.valueCate).length <= 0
                      ? ''
                      : state?.valueCate.name
                  }
                  style={[
                    styles.inputSelect,
                    {
                      fontSize: width < 960 ? 23 : 18,
                    },
                  ]}
                  placeholderTextColor="blue"
                  editable={false}
                  selectTextOnFocus={false}
                  placeholder="Danh mục"
                />
                {state?.valueCate == undefined ||
                  String(state?.valueCate).length <= 0 ? (
                  <AntDesign
                    name="down"
                    size={18}
                    color={'blue'}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setState({ valueCate: undefined })}
                    style={{ position: 'absolute', top: 10, right: 10 }}>
                    <AntDesign name="close" size={18} color={'red'} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
            {propParams?.table.timeBookTable !== 'null' && (
              <TouchableOpacity
                onPress={() => setState({ showInforBookTable: true })}>
                <AntDesign
                  name="infocirlceo"
                  size={21}
                  color={'#fff'}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={{
            width: width < 960 ? '0%' : '35%',
            borderColor: 'gray',
            borderLeftWidth: 1,
          }}>
          <Text style={[styles.proOrder, { fontSize: widthScale * 33}]}>Sản phẩm đã chọn</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
        }}>
        <View style={{ width: width < 960 ? '100%' : '65%' }}>
          <ListPro
            params={propParams}
            valueCate={state?.valueCate}
            selectModalCate={state?.selectModalCate}
            hiddeViewCate={(e: any) =>
              setState({ selectModalCate: false, valueCate: e })
            }
            order={(e: any) => {
              setState({ loading: true, tableOrder: e });
              setState({ loading: false });
            }}
            timeStartOrder={(e: any) => setState({ timeStartOrder: e })}
            data={state?.tableOrder}
          />
        </View>

        <View style={[styles.right, { width: width < 960 ? '0%' : '35%' }]}>
          <View style={{ flex: 1 }}>
            <View style={{ padding: 5, height: '70%' }}>
              <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {(state?.tableOrder?.length <= 0 ||
                    state?.tableOrder == undefined) && (
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
                            fontSize: widthScale * 28,
                          }}>
                          Chưa có sản phẩm
                        </Text>
                      </View>
                    )}
                  {state?.loading == true && (
                    <ActivityIndicator size="large" color={'blue'} />
                  )}
                  {state?.tableOrder
                    ?.slice()
                    .reverse()
                    ?.map((item: any, index: any) => {
                      return (
                        <View
                          style={[
                            styles.listOrder,
                            state?.tableOrder?.length - 1 !== index && {
                              borderBottomWidth: 0.5,
                            },
                          ]}
                          key={item}
                          onTouchEnd={() => console.log('dâsdasdads')}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '70%',
                              overflow: 'hidden',
                            }}>
                            <TouchableOpacity
                              onPress={() => deleteOrder(item.id)}>
                              <AntDesign
                                name="closecircle"
                                color={'tomato'}
                                size={22}
                                style={{ marginRight: 15 }}
                              />
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'column' }}>
                              <Text style={styles.proname} numberOfLines={2}>
                                {item.name}
                              </Text>
                              {item?.weight > 0 ? (
                                <Text>{item?.weight}kg</Text>
                              ) : null}
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
                                onSubmit({ data: item, check: 'decrease' })
                              }>
                              <Entypo
                                name="circle-with-minus"
                                color={'#FF6633'}
                                size={30}
                              />
                            </TouchableOpacity>
                            <TextInput
                              value={`${state?.valueAmount?.value == undefined
                                ? item.amount
                                : item.id == state?.valueAmount.id
                                  ? state?.valueAmount?.value
                                  : item.amount
                                }`}
                              style={styles.text}
                              keyboardType="numeric"
                              onChangeText={e =>
                                startTransition(() => {
                                  setState({
                                    valueAmount: { value: e, id: item.id },
                                  });
                                })
                              }
                              onBlur={() =>
                                uploadAmount({ value: item, id: item.id })
                              }
                            />
                            <TouchableOpacity
                              onPress={() =>
                                onSubmit({ data: item, check: 'add' })
                              }>
                              <AntDesign
                                name="pluscircle"
                                color={'#FF6633'}
                                size={25}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                </ScrollView>
              </SafeAreaView>
            </View>
            <View style={[styles.bott, { height: '30%' }]}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  paddingHorizontal: 5,
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  value={state?.value}
                  onChangeText={e => setState({ value: e })}
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
                  onPress={() => (
                    setState({ valueSale: state?.value, value: undefined }),
                    Keyboard.dismiss()
                  )}>
                  <Text style={styles.xn}>Áp dụng</Text>
                </TouchableOpacity>
                {state?.valueSale !== undefined && (
                  <TouchableOpacity
                    onPress={() => (
                      setState({ valueSale: undefined, value: undefined }),
                      Keyboard.dismiss()
                    )}>
                    <Text style={[styles.xn, { backgroundColor: 'red' }]}>
                      Hủy
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View>
                <View>
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingHorizontal: 5,
                      },
                    ]}>
                    <View
                      style={[
                        styles.flex,
                        {
                          width: '100%',
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent:
                            state?.valueSale !== undefined &&
                              state?.valueSale !== 0
                              ? 'space-between'
                              : 'flex-end',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.price,
                            state?.valueSale !== undefined &&
                              state?.valueSale !== 0
                              ? { fontSize: 19 }
                              : { fontSize: 25 },
                          ]}>
                          Tổng tiền :{' '}
                        </Text>
                        <Text
                          style={[
                            styles.priceRed,
                            state?.valueSale !== undefined &&
                              state?.valueSale !== 0
                              ? { fontSize: 21 }
                              : { fontSize: 27 },
                          ]}>
                          {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          đ
                        </Text>
                      </View>
                      {state?.valueSale !== undefined &&
                        state?.valueSale !== 0 &&
                        String(state?.valueSale).length >= 1 ? (
                        <View
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              width: '100%',
                            }}>
                            <Text
                              style={[
                                styles.price,
                                { marginVertical: 10, fontSize: 20 },
                              ]}>
                              Giảm giá :
                            </Text>
                            <Text
                              style={[
                                styles.priceRed,
                                { marginVertical: 10, fontSize: 20 },
                              ]}>
                              -{state?.valueSale}%
                            </Text>
                          </View>
                          <View
                            style={[
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 10,
                              },
                            ]}>
                            <Text style={[styles.price, { fontSize: 23 }]}>
                              Tổng tiền thanh toán :{' '}
                            </Text>
                            <Text style={[styles.priceRed, { fontSize: 25 }]}>
                              {Math.ceil(sum * ((100 - state?.valueSale) / 100))
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                              đ
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </View>

                <TouchableOpacity onPress={() => setState({ checkPayy: true })}>
                  <Text style={styles.tt}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      {width < 960 && (
        <ListOrderMobile
          tableOrder={state?.tableOrder}
          valueAmount={state?.valueAmount}
          saveValueAmount={(e: any) =>
            setState({ valueAmount: { value: e.value, id: e.id } })
          }
          uploadAmount={(e: any) => uploadAmount(e)}
          sum={sum}
          valueSale={state?.valueSale}
          value={state?.value}
          setState={() => setState({ valueSale: undefined })}
          setCheckPayy={(e: boolean) => setState({ checkPayy: e })}
          setValue={(e: any) => setState({ value: e })}
          setValueSale={() =>
            setState({ valueSale: state?.value, value: undefined })
          }
          onSubmit={(e: any) => onSubmit(e)}
          hiddeAnimated={(e: boolean) => setCheckAnimated(e)}
          checkAnimated={checkAnimated}
        />
      )}

      {state?.tableOrder?.length > 0 && state?.checkPayy == true ? (
        <ModalCheckPay
          checkPay={state?.checkPayy}
          hiidenCheckPay={async (e: any) => {
            // setCheckPayy(false)
            handle(e)
          }}
          valueSale={state?.valueSale}
          params={propParams}
          orders={state?.tableOrder}
          sum={sum}
          data={state?.tableOrder}
          table={propParams?.table}
          timeStart={state?.timeStartOrder}
        />
      ) : null}

      {/* hiện thông tin đặt bàn nếu có */}
      {state?.showInforBookTable == true && (
        <ShowInfoBookTable
          togger={(e: boolean) => setState({ showInforBookTable: e })}
          infoData={propParams?.table}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Order;

const styles = StyleSheet.create({
  flex: {
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
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
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderLeftWidth: 1,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  proOrder: {
    color: '#fff',
    backgroundColor: 'blue',
    paddingHorizontal: 5,
    paddingVertical: 15,
    textAlign: 'center',
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
    fontSize: 20,
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
    fontWeight: '500',
  },
  tab: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderColor: 'blue',
    borderWidth: 1,
  },
  showOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  cart: {
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ttmb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    width: '100%',
    borderTopWidth: 1,
    borderColor: 'gray',
    paddingTop: 15,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 18.5,
    alignItems: 'center',
  },
  inputSelect: {
    paddingLeft: 10,
    paddingVertical: 3,
    marginRight: 10,
    borderRadius: 3,
    width: 260,
    color: 'red',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  removeSale: {
    backgroundColor: 'red',
    borderRadius: 100,
    width: 30,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSale_text: {
    color: '#fff',
    fontSize: 20,
  },
});
