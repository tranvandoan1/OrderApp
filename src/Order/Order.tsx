import {
  ActivityIndicator,
  Animated,
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
} from 'react-native';
import React, { startTransition, useEffect, useRef, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ListPro from './ListPro';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../App/Store';
import { getProductAll } from './../Features/ProductsSlice';
import ModalCheckPay from './../Modal/ModalCheckPay';
import { Size, SizeScale } from '../Component/size';
import { addOrderTable, getAllTable } from '../Features/TableSlice';
import { addOrder } from '../Features/OrderSlice';
import { removeOrderTable } from '../API/TableAPI';
import { removeOrder } from './../Features/TableSlice';
import { add } from './../API/Order';
type Props = {
  route: any;
  navigation: any;
};

const Order = (props: Props) => {

  const width = Size().width;
  const widthScale = SizeScale().width;
  const dispatch = useDispatch<AppDispatch>();
  const propParams = props?.route?.params;

  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<any>();//lấy value khi nhập mã giảm giá
  const [valueAmount, setValueMount] = useState<any>();//lấy số lượng khi nhập số lượng
  const [valueSale, setValueSale] = useState<any>();//lấy giá trị giảm giá khi ấn áp dụng
  const [checkPayy, setCheckPayy] = useState<boolean>(false);
  const [checkAnimated, setCheckAnimated] = useState<boolean>(false);
  const [valueCate, setValueCate] = useState<any>();
  const [selectModalCate, setSelectModalCate] = useState<boolean>(false);
  const [infor, setInfor] = useState(false);
  const [timeStartOrder, setTimeStartOrder] = useState<any>();
  const [tableOrder, setTableOrder] = useState<any>(propParams?.table?.orders)
  console.log(valueSale, 'valueSale')
  useEffect(() => {
    dispatch(getProductAll());
  }, []);
  // tính tổng tiền
  const prices = tableOrder?.map((item: any) => {
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
    const dataNew = tableOrder?.filter((item: any) => item.id !== id);
    setLoading(true);
    setValueMount(undefined);
    setTableOrder(dataNew)
    setLoading(false);
  };
  const onSubmit = async (itemm: any) => {
    width < 960 && setLoading(true);
    const dataOrder = tableOrder?.find(
      (item: any) => item.id == itemm.data.id,
    );
    if (
      (dataOrder.amount >= 1 && itemm.check == 'add') ||
      (dataOrder.amount > 1 && itemm.check == 'decrease')
    ) {
      const dataNew: any = [];
      tableOrder?.map((itemOrder: any) => {
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

      setLoading(true);
      setTableOrder(dataNew)

      setLoading(false);
    } else if (dataOrder.amount <= 1 && itemm.check == 'decrease') {
      deleteOrder(itemm.data.id);
    }
    width < 960 && setLoading(false);
  };
  const uploadAmount = async (item: any) => {
    // @ts-ignore
    const dataNew: any = [];
    tableOrder?.map((itemOrder: any) => {
      if (itemOrder.id == item.id) {
        dataNew.push({
          ...itemOrder,
          amount:
            valueAmount == undefined
              ? item.amount
              : valueAmount.value,
        });
      } else {
        dataNew.push(itemOrder);
      }
    });
    setLoading(true);
    setValueMount(undefined);
    setTableOrder(dataNew)
    setLoading(false);
  };

  const fadeAnim = useRef(new Animated.Value(100 * widthScale)).current;

  checkAnimated == true
    ? // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 1000 * widthScale,
      duration: 1100,
    }).start()
    : // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 100 * widthScale,
      duration: 1100,
    }).start();
  // lưu lại những món ăn vừa order khi tắt ứng dụng
  AppState.addEventListener('change', async (e) => {

    if ((JSON.stringify(tableOrder) == JSON.stringify(propParams?.table?.orders)) == false) {
      await dispatch(
        // @ts-ignore
        addOrderTable({
          data: tableOrder,
          id_table: propParams?.table._id,
          time_start: timeStartOrder,
        }),
      );
      setTableOrder([])
    }
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'blue',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '10%'
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
                props.navigation?.navigate('home')
                if ((JSON.stringify(tableOrder) == JSON.stringify(propParams?.table?.orders)) == false) {
                  props.navigation?.navigate('home', { loading: true, id: propParams?.table?._id })
                  await dispatch(
                    // @ts-ignore
                    addOrderTable({
                      data: tableOrder,
                      id_table: propParams?.table._id,
                      time_start: timeStartOrder,
                    }),
                  );
                  setTableOrder([])
                  props.navigation?.navigate('home', { loading: false, id: propParams?.table?._id })
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
            <TouchableOpacity onPress={() => setSelectModalCate(true)}>
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
                    valueCate == undefined || String(valueCate).length <= 0
                      ? ''
                      : valueCate.name
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
                {valueCate == undefined || String(valueCate).length <= 0 ? (
                  <AntDesign
                    name="down"
                    size={18}
                    color={'blue'}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setValueCate(undefined)}
                    style={{ position: 'absolute', top: 10, right: 10 }}>
                    <AntDesign name="close" size={18} color={'red'} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
            {propParams?.table.timeBookTable !== 'null' && (
              <TouchableOpacity onPress={() => setInfor(true)}>
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
          <Text style={styles.proOrder}>Sản phẩm đã chọn</Text>
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
            valueCate={valueCate}
            selectModalCate={selectModalCate}
            hiddeViewCate={(e: any) => (
              setSelectModalCate(false), setValueCate(e)
            )}
            order={(e: any) => {
              setLoading(true)
              setTableOrder(e)
              setLoading(false)

            }}
            timeStartOrder={(e: any) => setTimeStartOrder(e)}
            data={tableOrder}
          />
        </View>

        <View style={[styles.right, { width: width < 960 ? '0%' : '35%' }]}>
          <View style={{ flex: 1 }}>
            <View style={{ padding: 5, height: '70%' }}
            >
              <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}
                >
                  {(tableOrder?.length <= 0 ||
                    tableOrder == undefined) && (
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 25,
                          }}>
                          Chưa có sản phẩm
                        </Text>
                      </View>
                    )}
                  {loading == true && (
                    <ActivityIndicator size="large" color={'blue'} />
                  )}
                  {tableOrder
                    ?.slice()
                    .reverse()
                    ?.map((item: any, index: any) => {
                      return (
                        <View
                          style={[
                            styles.listOrder,
                            tableOrder?.length - 1 !== index && {
                              borderBottomWidth: 0.5,
                            },
                          ]}
                          key={item}
                          onTouchEnd={() => console.log('dâsdasdads')}
                        >
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
                              value={`${valueAmount == undefined
                                ? item.amount
                                : item.id == valueAmount.id
                                  ? valueAmount.value
                                  : item.amount
                                }`}
                              style={styles.text}
                              keyboardType="numeric"
                              onChangeText={e => setValueMount({ value: e, id: item.id })}
                              onBlur={() => uploadAmount({ value: item, id: item.id })}
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
                  value={value}
                  onChangeText={e =>
                    startTransition(() => {
                      setValue(e);
                    })
                  }
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
                  onPress={() => (setValueSale(value), setValue(undefined), Keyboard.dismiss())}>
                  <Text style={styles.xn}>Áp dụng</Text>
                </TouchableOpacity>
                {
                  valueSale !== undefined &&
                  <TouchableOpacity
                    onPress={() => (setValueSale(undefined), setValue(undefined), Keyboard.dismiss())}>
                    <Text style={[styles.xn, { backgroundColor: 'red' }]}>Hủy</Text>
                  </TouchableOpacity>
                }
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
                    <View style={[styles.flex, {
                      width: '100%'
                    }]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent:
                            valueSale !== undefined && valueSale !== 0
                              ? 'space-between'
                              : 'flex-end',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.price,
                            valueSale !== undefined && valueSale !== 0
                              ? { fontSize: 19 }
                              : { fontSize: 25 },
                          ]}>
                          Tổng tiền : {' '}
                        </Text>
                        <Text
                          style={[
                            styles.priceRed,
                            valueSale !== undefined && valueSale !== 0
                              ? { fontSize: 21 }
                              : { fontSize: 27 },
                          ]}>
                          {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          đ
                        </Text>
                      </View>
                      {valueSale !== undefined &&
                        valueSale !== 0 &&
                        String(valueSale).length >= 1 ? (
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
                              -{valueSale}%
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
                              {Math.ceil(sum * ((100 - valueSale) / 100))
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

                <TouchableOpacity onPress={() => setCheckPayy(true)}>
                  <Text style={styles.tt}>Thanh toán</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      {width < 960 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            left: 0,
            right: 0,
          }}>
          <View style={styles.tab}>
            <SafeAreaView>
              <Animated.View
                style={[
                  {
                    height: fadeAnim,
                  },
                ]}>
                {checkAnimated == true && (
                  <ScrollView>
                    <TouchableOpacity
                      onPress={() => setCheckAnimated(!checkAnimated)}>
                      <Text style={styles.proOrder}>Sản phẩm đã chọn</Text>
                    </TouchableOpacity>
                    <View>
                      {tableOrder
                        ?.slice()
                        .reverse()
                        ?.map((item: any, index: any) => {
                          return (
                            <View
                              style={[
                                styles.listOrder,
                                { paddingVertical: 10 },
                                tableOrder?.length - 1 !== index && {
                                  borderBottomWidth: 0.5,
                                },
                              ]}
                              key={index}>
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
                                    size={33}
                                    style={{ marginRight: 15 }}
                                  />
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'column' }}>
                                  <Text
                                    style={[styles.proname, { fontSize: 28 }]}
                                    numberOfLines={2}>
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
                                    size={40}
                                  />
                                </TouchableOpacity>
                                <TextInput
                                  value={`${valueAmount == undefined
                                    ? item.amount
                                    : item._id == valueAmount.id
                                      ? valueAmount.value
                                      : item.amount
                                    }`}
                                  style={[
                                    styles.text,
                                    { fontSize: 28, paddingHorizontal: 10 },
                                  ]}
                                  keyboardType="numeric"
                                  onChangeText={e => setValueMount({ value: e, id: item.id })}
                                  onBlur={() => uploadAmount({ value: item, id: item.id })}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    onSubmit({ data: item, check: 'add' })
                                  }>
                                  <AntDesign
                                    name="pluscircle"
                                    color={'#FF6633'}
                                    size={35}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                    </View>
                  </ScrollView>
                  // </View>
                )}
                <TouchableOpacity
                  onPress={() => setCheckAnimated(!checkAnimated)}>
                  {checkAnimated !== true && (
                    <View
                      style={[
                        styles.showOrder,
                        { height: width < 960 ? 80 : 100 },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            styles.price,
                            {
                              fontSize: 30,
                              color: 'blue',
                            },
                          ]}>
                          Tổng tiền :
                        </Text>
                        <Text style={[styles.priceRed, { fontSize: 30 }]}>
                          {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          đ
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {loading == true && (
                          <ActivityIndicator size={40} color={'blue'} />
                        )}
                        <View
                          style={[
                            styles.cart,
                            {
                              borderColor: 'blue',
                            },
                          ]}>
                          <Ionicons
                            name="cart"
                            style={{
                              fontSize: 40,
                              color: 'blue',
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 30,
                              color: 'red',
                              fontWeight: '500',
                              marginLeft: 10,
                            }}>
                            {tableOrder?.length}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
                <View>
                  <View style={{ width: '100%' }}>
                    <View style={styles.ttmb}>
                      <Text
                        style={[
                          styles.price,
                          { fontSize: 30, textAlign: 'center' },
                        ]}>
                        Tổng tiền thanh toán :
                      </Text>
                      <Text
                        style={[
                          styles.priceRed,
                          { fontSize: 30, textAlign: 'center' },
                        ]}>
                        {(valueSale !== undefined &&
                          valueSale !== 0 &&
                          String(valueSale).length > 1
                          ? Math.ceil(sum * ((100 - valueSale) / 100))
                          : sum
                        )
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        đ
                      </Text>
                    </View>
                    {valueSale !== undefined &&
                      valueSale !== 0 &&
                      String(valueSale).length > 1 && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center',
                            marginBottom: 10,
                          }}>
                          <Text style={{ fontSize: 25, color: 'blue' }}>
                            Giảm giá :
                          </Text>
                          <Text style={{ fontSize: 25, color: 'red' }}>
                            {valueSale}%
                          </Text>
                        </View>
                      )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        width: '50%',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
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
                            fontSize: 20,
                            paddingLeft: 5,
                            paddingVertical: 0,
                            width: '60%',
                          }}
                        />
                        <TouchableOpacity
                          style={{ width: '40%' }}
                          onPress={() => (
                            setValueSale(value), setValue(undefined)
                          )}>
                          <Text
                            style={[
                              styles.xn,
                              { fontSize: 25, paddingVertical: 10 },
                            ]}>
                            Áp dụng
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setCheckPayy(true)}
                      style={{ width: '50%' }}>
                      <Text style={styles.tt}>Thanh toán</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </SafeAreaView>
          </View>
        </View>
      )}

      {tableOrder?.length > 0 && checkPayy == true ? (
        <ModalCheckPay
          checkPay={checkPayy}
          hiidenCheckPay={async (e: any) => {

            // setCheckPayy(false)
            if (e !== 0) {
              props.navigation?.navigate('home', { loading: true, id: propParams?.table?._id })

              // @ts-ignore
              await dispatch(removeOrder({ id: e?.table_id }));
              props.navigation?.navigate('home', { loading: false, id: propParams?.table?._id })
              ToastAndroid.show(`Thanh toán thành công`, ToastAndroid.SHORT);
              // @ts-ignore
              await add(e);
            } else {
              setCheckPayy(false)

            }
          }}
          valueSale={valueSale}
          params={propParams}
          saveorders={tableOrder}
          sum={sum}
          data={tableOrder}
          table={propParams?.table}
          timeStart={timeStartOrder}
        />
      ) : null}
      {infor == true && (
        <View
          onTouchEndCapture={() => setInfor(false)}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 100,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: widthScale * 400,
              height: 200,
              backgroundColor: '#fff',
              elevation: 20,
              shadowColor: 'blue',
              borderRadius: 5,
              padding: 20,
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 21,
                textAlign: 'center',
                marginVertical: 10,
              }}>
              {propParams?.table.name}
            </Text>
            <Text style={{ color: 'black', fontWeight: '500', fontSize: 18 }}>
              Khách hàng :
              <Text style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
                {propParams?.table.nameUser}
              </Text>
            </Text>
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: 18,
                marginVertical: 10,
              }}>
              Thời gian đặt :
              <Text style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
                {propParams?.table.timeBookTable}
              </Text>
            </Text>
            <Text style={{ color: 'black', fontWeight: '500', fontSize: 18 }}>
              Số lượng :
              <Text style={{ color: 'red', fontWeight: '500', fontSize: 20 }}>
                {propParams?.table.amount}
              </Text>
            </Text>
          </View>
        </View>
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
});
