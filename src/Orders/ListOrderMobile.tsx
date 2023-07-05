import {
  Animated,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { startTransition, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Size, SizeScale } from '../Component/size';

type Props = {
  tableOrder: any;
  valueAmount: any;
  saveValueAmount: (e: any) => void;
  onSubmit: (e: any) => void;
  uploadAmount: (e: any) => void;
  setValue: (e: any) => void;
  hiddeAnimated: (e: any) => void;
  setCheckPayy: (e: any) => void;
  setState: () => void;
  setValueSale: () => void;
  sum: number;
  valueSale: any;
  value: string | undefined;
  checkAnimated: boolean;
};
const ListOrderMobile: React.FC<Props> = ({
  tableOrder,
  valueAmount,
  saveValueAmount,
  setValue,
  uploadAmount,
  sum,
  setState,
  valueSale,
  value,
  setValueSale,
  onSubmit,
  hiddeAnimated,
  checkAnimated,
  setCheckPayy,
}) => {
  const width = Size().width;
  const widthScale = SizeScale().width;
  const fadeAnim = useRef(new Animated.Value(100 * widthScale)).current;
  checkAnimated == true
    ? // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 1000 * widthScale,
      duration: 800,
    }).start()
    : // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 100 * widthScale,
      duration: 800,
    }).start();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0,
        right: 0,
        zIndex: 11,
      }}>
      <View style={styles.tab}>
        <SafeAreaView>
          <Animated.View
            style={[
              {
                height: fadeAnim,
              },
            ]}>
            {/* {checkAnimated == true && ( */}
            <ScrollView>
              <TouchableOpacity
                onPress={() => {
                  hiddeAnimated(false);
                }}>
                <Text style={[styles.proOrder, { fontSize: widthScale * 28 }]}>Sản phẩm đã chọn</Text>
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
                          // onPress={() => deleteOrder(item.id)}
                          >
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
                            value={`${valueAmount.value == undefined
                                ? item.amount
                                : item.id == valueAmount.id
                                  ? valueAmount.value
                                  : item.amount
                              }`}
                            style={[
                              styles.text,
                              { fontSize: 28, paddingHorizontal: 10 },
                            ]}
                            keyboardType="numeric"
                            onChangeText={e =>
                              startTransition(() => {
                                saveValueAmount({ value: e, id: item.id });
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
                              size={35}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </ScrollView>
            {/* </View> */}
            {/* )} */}
            <TouchableOpacity
              onPress={() => {
                hiddeAnimated(true);
              }}>
              {checkAnimated !== true && (
                <View
                  style={[styles.showOrder, { height: width < 960 ? 90 : 100 }]}>
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
                    <Text style={[styles.priceRed, { fontSize: 30 }]}>
                      {sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* {loading == true && (
                      <ActivityIndicator size={40} color={'blue'} />
                    )} */}
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
                        {tableOrder?.length == null ? 0 : tableOrder?.length}
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
                    style={[styles.price, { fontSize: 30, textAlign: 'center' }]}>
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
                      <TouchableOpacity
                        style={styles.removeSale}
                        onPress={() => setState()}>
                        <Text style={styles.removeSale_text}>X</Text>
                      </TouchableOpacity>
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
                      editable={
                        tableOrder?.length == null || tableOrder?.length <= 0
                          ? false
                          : true
                      }
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
                      disabled={
                        tableOrder?.length == null || tableOrder?.length <= 0
                          ? true
                          : false
                      }
                      onPress={() => {
                        setValueSale();
                        Keyboard.dismiss();
                      }}>
                      <Text
                        style={[
                          styles.xn,
                          {
                            fontSize: 25,
                            paddingVertical: 10,
                            backgroundColor:
                              tableOrder?.length == null ||
                                tableOrder?.length <= 0
                                ? 'gray'
                                : 'blue',
                          },
                        ]}>
                        Áp dụng
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setCheckPayy(true)}
                  disabled={
                    tableOrder?.length == null || tableOrder?.length <= 0
                      ? true
                      : false
                  }
                  style={{ width: '50%' }}>
                  <Text
                    style={[
                      styles.tt,
                      {
                        backgroundColor:
                          tableOrder?.length == null || tableOrder?.length <= 0
                            ? 'gray'
                            : 'tomato',
                      },
                    ]}>
                    Thanh toán
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default ListOrderMobile;

const styles = StyleSheet.create({
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
