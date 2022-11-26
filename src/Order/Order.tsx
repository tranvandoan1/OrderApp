import {
  ActivityIndicator,
  Animated,
  Button,
  Dimensions,
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
import React, {startTransition, useEffect, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ListPro from './ListPro';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAllSaveOrder, removeSaveOrder} from '../Features/SaveOrderSlice';
import {uploadSaveOrderFind} from './../Features/SaveOrderSlice';
import {getProductAll} from './../Features/ProductsSlice';
import ModalCheckPay from './../Modal/ModalCheckPay';
import {Size, SizeScale} from '../size';
type Props = {
  route: any;
  navigation: any;
};

const Order = (props: Props) => {
  const width = Size().width;
  const widthScale = SizeScale().width;
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const saveorders = useAppSelect((data: any) => data.saveorders.value);
  const products = useAppSelect((data: any) => data.products.value);
  const propParams = props?.route?.params;
  const newOrder = saveorders?.filter(
    (item: any) => item.id_table == propParams?.table._id,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<any>();
  const [valueAmount, setValueMount] = useState<any>();
  const [valueSale, setValueSale] = useState<any>();
  const [checkPayy, setCheckPayy] = useState<boolean>(false);
  const [valueName, setValueName] = useState<any>();
  const [checkAnimated, setCheckAnimated] = useState<boolean>(false);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [valueCate, setValueCate] = useState<any>();
  const [selectModalCate, setSelectModalCate] = useState(false);
  const [infor, setInfor] = useState(false);
  const [id, setId] = useState<any>();
  useEffect(() => {
    dispatch(getAllSaveOrder());
    dispatch(getProductAll());
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
    width < 960 && setLoadingOrder(true);
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

      // @ts-ignore
      await dispatch(removeSaveOrder(itemm.data._id));
      setLoading(false);
    }
    width < 960 && setLoadingOrder(false);
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
    // @ts-ignore
    await dispatch(removeSaveOrder(id));
    setLoading(false);
  };

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(100 * widthScale)).current;

  checkAnimated == true
    ? // @ts-ignore
      Animated.timing(fadeAnim, {
        toValue: 1000 * widthScale,
        duration: 300,
      }).start()
    : // @ts-ignore
      Animated.timing(fadeAnim, {
        toValue: 100 * widthScale,
        duration: 300,
      }).start();

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
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'blue',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width < 960 ? '100%' : '65%',
          }}>
          <View style={[styles.header, {width: '50%'}]}>
            <TouchableOpacity
              onPress={() => props.navigation?.navigate('home')}>
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
                    style={{position: 'absolute', top: 10, right: 10}}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setValueCate(undefined)}
                    style={{position: 'absolute', top: 10, right: 10}}>
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
                  color={'#00FF00'}
                  style={{marginRight: 20}}
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
        <View style={{width: width < 960 ? '100%' : '65%'}}>
          <ListPro
            loading={(e: any) => setLoading(e)}
            params={propParams}
            showOrder={(e: any) => setLoadingOrder(e)}
            valueCate={valueCate}
            selectModalCate={selectModalCate}
            hiddeViewCate={(e: any) => (
              setSelectModalCate(false), setValueCate(e)
            )}
          />
        </View>

        <View style={[styles.right, {width: width < 960 ? '0%' : '35%'}]}>
          <View style={{flex: 1}}>
            <View style={{padding: 5, height: '70%'}}>
              <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {newOrder.length <= 0 && (
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
                  )}
                  {/* //  products.length <= 0 ? (
                  //   <View style={styles.loading1}>
                  //     <ActivityIndicator size="large" color={'blue'} />
                  //   </View>
                  // ) : */}
                  {loading == true && (
                    <ActivityIndicator size="large" color={'blue'} />
                  )}
                  {newOrder
                    ?.slice()
                    .reverse()
                    ?.map((item: any, index: any) => {
                      return (
                        <View
                          style={[
                            styles.listOrder,
                            newOrder.length - 1 !== index && {
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
                              onPress={() => deleteOrder(item._id)}>
                              <AntDesign
                                name="closecircle"
                                color={'tomato'}
                                size={22}
                                style={{marginRight: 15}}
                              />
                            </TouchableOpacity>

                            {/* <Text style={styles.stt}>{index + 1}</Text> */}
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
                              onPress={() =>
                                onSubmit({data: item, check: 'add'})
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
            <View style={[styles.bott, {height: '30%'}]}>
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
                  onPress={() => (setValueSale(value), setValue(undefined))}>
                  <Text style={styles.xn}>Áp dụng</Text>
                </TouchableOpacity>
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
                    <View style={styles.flex}>
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
                              ? {fontSize: 19}
                              : {fontSize: 25},
                          ]}>
                          Tổng tiền :{' '}
                        </Text>
                        <Text
                          style={[
                            styles.priceRed,
                            valueSale !== undefined && valueSale !== 0
                              ? {fontSize: 21}
                              : {fontSize: 27},
                          ]}>
                          {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          đ
                        </Text>
                      </View>
                      {valueSale !== undefined &&
                      valueSale !== 0 &&
                      String(valueSale).length > 1 ? (
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
                                {marginVertical: 10, fontSize: 20},
                              ]}>
                              Giảm giá :{' '}
                            </Text>
                            <Text
                              style={[
                                styles.priceRed,
                                {marginVertical: 10, fontSize: 20},
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
                            <Text style={[styles.price, {fontSize: 23}]}>
                              Tổng tiền thanh toán :{' '}
                            </Text>
                            <Text style={[styles.priceRed, {fontSize: 25}]}>
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
                  // <View>

                  <ScrollView>
                    <TouchableOpacity
                      onPress={() => setCheckAnimated(!checkAnimated)}>
                      <Text style={styles.proOrder}>Sản phẩm đã chọn</Text>
                    </TouchableOpacity>
                    <View>
                      {newOrder
                        ?.slice()
                        .reverse()
                        ?.map((item: any, index: any) => {
                          return (
                            <View
                              style={[
                                styles.listOrder,
                                {paddingVertical: 10},
                                newOrder.length - 1 !== index && {
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
                                  onPress={() => deleteOrder(item._id)}>
                                  <AntDesign
                                    name="closecircle"
                                    color={'tomato'}
                                    size={33}
                                    style={{marginRight: 15}}
                                  />
                                </TouchableOpacity>

                                {/* <Text style={styles.stt}>{index + 1}</Text> */}
                                <View style={{flexDirection: 'column'}}>
                                  <Text
                                    style={[styles.proname, {fontSize: 28}]}
                                    numberOfLines={2}>
                                    {item.name}
                                  </Text>
                                  {item.weight && (
                                    <Text style={{fontSize: 20}}>
                                      {item.weight}kg
                                    </Text>
                                  )}
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
                                    size={40}
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
                                  style={[
                                    styles.text,
                                    {fontSize: 28, paddingHorizontal: 10},
                                  ]}
                                  keyboardType="numeric"
                                  onChangeText={e => setValueMount(e)}
                                  onBlur={() => uploadAmount(item)}
                                  onPressIn={() => setId(item._id)}
                                />
                                <TouchableOpacity
                                  onPress={() =>
                                    onSubmit({data: item, check: 'add'})
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
                        {height: width < 960 ? 80 : 100},
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
                          Tổng tiền :{' '}
                        </Text>
                        <Text style={[styles.priceRed, {fontSize: 30}]}>
                          {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                          đ
                        </Text>
                      </View>

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {loadingOrder == true && (
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
                            {newOrder.length}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
                <View>
                  <View>
                    <View style={styles.ttmb}>
                      <Text
                        style={[
                          styles.price,
                          {fontSize: 30, textAlign: 'center'},
                        ]}>
                        Tổng tiền thanh toán :{' '}
                      </Text>
                      <Text
                        style={[
                          styles.priceRed,
                          {fontSize: 30, textAlign: 'center'},
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
                          <Text style={{fontSize: 25, color: 'blue'}}>
                            Giảm giá :{' '}
                          </Text>
                          <Text style={{fontSize: 25, color: 'red'}}>
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
                          style={{width: '40%'}}
                          onPress={() => (
                            setValueSale(value), setValue(undefined)
                          )}>
                          <Text
                            style={[
                              styles.xn,
                              {fontSize: 25, paddingVertical: 10},
                            ]}>
                            Áp dụng
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setCheckPayy(true)}
                      style={{width: '50%'}}>
                      <Text style={styles.tt}>Thanh toán</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </SafeAreaView>
          </View>
        </View>
      )}

      {newOrder?.length > 0 && checkPayy == true ? (
        <ModalCheckPay
          checkPay={checkPayy}
          hiidenCheckPay={(e: any) => (
            setCheckPayy(false),
            // , setPayy(e.check)
            setValueName(e.name)
          )}
          valueSale={valueSale}
          params={propParams}
          saveorders={newOrder}
          sum={sum}
        />
      ) : null}
      {/* {newOrder?.length > 0 && payy == true && (
        <ModalPay
          payy={payy}
          hiidenPay={() => (setCheckPayy(false), setPayy(false))}
          valueSale={valueSale}
          valueName={valueName}
          params={propParams}
          saveorders={newOrder}
          sum={sum}
        />
      )} */}
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
            <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>
              Khách hàng :{' '}
              <Text style={{color: 'red', fontWeight: '500', fontSize: 20}}>
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
              Thời gian đặt :{' '}
              <Text style={{color: 'red', fontWeight: '500', fontSize: 20}}>
                {propParams?.table.timeBookTable}
              </Text>
            </Text>
            <Text style={{color: 'black', fontWeight: '500', fontSize: 18}}>
              Số lượng :{' '}
              <Text style={{color: 'red', fontWeight: '500', fontSize: 20}}>
                {' '}
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
