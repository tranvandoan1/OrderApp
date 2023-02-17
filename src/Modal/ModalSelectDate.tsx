import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
  startTransition,
} from 'react';
import { Size } from '../Component/size';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FlatGrid } from 'react-native-super-grid';
import { Easing } from 'react-native/Libraries/Animated/Easing';
type Props = {
  selectDateProps: any;
  hiddenSelectDate: (e: any) => void;
  dataOrders: any;
};
type State = {
  buttonSelectMonth: boolean;
  buttonSelectDate: boolean;
  filter: number;
  valueYear: any;
  monthSelect: any;
  selectCalendar: any;
};
const ModalSelectDate: React.FC<Props> = ({
  selectDateProps,
  hiddenSelectDate,
  dataOrders,
}) => {
  const monthConvert = `${String(moment().month() + 1).length == 1
      ? `0${moment().month() + 1}`
      : moment().month() + 1
    }`;
  const dateConvert = `${String(moment().date()).length == 1
      ? `0${moment().date()}`
      : moment().date()
    }`;
  const width = Size().width;
  const [state, setState] = useReducer(
    (state: State, newState: Partial<State>) => ({
      ...state,
      ...newState,
    }),
    {
      buttonSelectMonth: false, //hiện tháng để chọn
      buttonSelectDate: true, //hiện ngày để chọn
      filter: 1, //ấn button chọn lọc theo ngày, tháng, năm
      // selectDay: undefined, //chọn ngày
      monthSelect: undefined, //lưu ngày trong tháng
      valueYear: undefined,
      selectCalendar: {
        //lưu giá trị tháng năm khi ấn next hoặc prev
        date: dateConvert,
        month: monthConvert,
        year: moment().year(),
      },
    },
  );
  console.log(state?.valueYear, 'valueYear');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // @ts-ignore
    Animated.timing(fadeAnim, {
      toValue: state?.buttonSelectMonth ? 1 : 0,
      duration: 1000,
    }).start();
  }, [state?.buttonSelectMonth]);
  useEffect(() => {
    console.log('có vào');
    // @ts-ignore
    Animated.timing(fadeAnim1, {
      toValue: state?.buttonSelectDate ? 1 : 0,
      duration: 1000,
    }).start();
  }, [state?.buttonSelectDate]);
  useEffect(() => {
    // @ts-ignore
    Animated.timing(fadeAnim1, {
      toValue: selectDateProps ? 1 : 0,
      duration: 1000,
    }).start();
  }, [selectDateProps]);

  const monthFor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // lấy lịch theo tháng
  const getWeekMonth = () => {
    let i = 0;
    let datanew: any = [];
    while (
      i <=
      (state?.selectCalendar?.month == '1' ||
        state?.selectCalendar?.month == '7' ||
        state?.selectCalendar?.month == '10'
        ? 5
        : 4)
    ) {
      let dates: string[] = [];
      const DATE_FORMAT = 'DD-MM-YYYY';
      let time: any = `${datanew?.length <= 0
          ? '1'
          : datanew[datanew?.length - 1].slice(0, 2) == '1'
            ? '2'
            : Number(datanew[datanew?.length - 1].slice(0, 2)) + 1
        }-${state?.selectCalendar?.month}-${state?.selectCalendar?.year}`;
      // days by week
      if (moment(time, DATE_FORMAT).day() == 0) {
        time = moment(time, DATE_FORMAT).add(-1).format(DATE_FORMAT);
      }
      // get monday in week
      const mondayInWeek = moment(time, DATE_FORMAT).day(1);
      dates.push(mondayInWeek.format(DATE_FORMAT));
      //  lấy ngày đầu trong tuần , sau đó thêm đến ngày Chủ Nhật
      for (let index = 1; index < 7; index++) {
        mondayInWeek.add('days', 1);
        dates.push(mondayInWeek.format(DATE_FORMAT));
      }
      datanew.push(...dates);
      i++; // tăng i lên nếu không sẽ bị lặp vô hạn
    }
    const data: any = [];
    datanew.map((item: any, index: any) => {
      if (index % 7 == 0) {
        data.push(index);
      }
    });
    const newDataMonth: any = [];
    data.map((itemIndex: any, indexDate: any) => {
      // lấy ra những thứ tự ngày đầu trong tuần
      const dataIndex = datanew.filter(
        (item: any, index: any) =>
          index <= Number(itemIndex) + 6 && index >= indexDate,
      );
      if (dataIndex.length <= 7) {
        // nếu mnarg đầu tiên là nhỏ bằng 7 thì lấy hết
        newDataMonth.push(dataIndex);
      } else {
        // nếu mảng thứ 2 mà lớn hơn 7 thì lấy độ dài mảng đấy từ đi 7 rồi xét điều kiện nếu index > độ dài mảng -7
        const findDate = dataIndex.filter(
          (itemKo: any, indexKo: any) =>
            indexKo > Number(dataIndex.length - 1) - 7,
        );
        newDataMonth.push(findDate);
      }
    });
    setState({ monthSelect: newDataMonth });
  };
  useEffect(() => {
    getWeekMonth();
  }, [state?.selectCalendar]);
  // kiều kiện để lấy ra được nhưng order theo ý chọn
  const conditions = (item: any) => {
    const time = new Date(item.updatedAt);
    return state?.filter == 1
      ? time.getDate() == state?.selectCalendar?.date &&
      time.getMonth() + 1 == state?.selectCalendar?.month &&
      time.getFullYear() == moment().year()
      : state?.filter == 2
        ? time.getMonth() + 1 == state?.selectCalendar?.month &&
        time.getFullYear() == state?.selectCalendar?.year
        : time.getFullYear() == (state?.valueYear == undefined || String(state?.valueYear).length <= 0
          ? moment().year()
          : state?.valueYear);
  };
  // lọc order
  const dataProps: any = [];
  dataOrders?.map((item: any) => {
    if (conditions(item)) {
      dataProps.push(item);
    }
  });
  let sum = 0;
  for (let i = 0; i < dataProps.length; i++) {
    sum += Math.ceil(dataProps[i].sumPrice * ((100 - dataProps[i].sale) / 100));
  }

  const apply = () => {
    hiddenSelectDate({
      sum: sum,
      date: {
        ...state?.selectCalendar,
        year:
          state?.valueYear == undefined || String(state?.valueYear).length <= 0
            ? moment().year()
            : state?.valueYear,
      },
      data: dataProps,
      filter: state?.filter,
    });

  };
  const today = () => {
    setState({
      selectCalendar: {
        date: dateConvert,
        month: monthConvert,
        year: moment().year(),
      },
    });
    const dataProps: any = [];
    dataOrders?.map((item: any) => {
      const time: any = new Date(item.updatedAt);
      if (conditions(item)) {
        dataProps.push(item);
      }
    });
    hiddenSelectDate({
      sum: sum,
      date: {
        date: dateConvert,
        month: monthConvert,
        year: moment().year(),
      },
      data: dataProps,
    });
  };
  return (
    <Modal transparent={true} visible={selectDateProps} animationType="slide">
      <View style={styles.centeredView}>
        <Pressable
          onPress={() => hiddenSelectDate('')}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}></Pressable>

        <View
          style={[
            styles.navigationContainer,
            {
              width: width < 960 ? (width < 539 ? '100%' : '90%') : '60%',
              height: 510,
            },
          ]}>
          <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
            <View
              style={{
                width: '40%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.title}>Chọn theo</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      state?.filter !== 1
                        ? setState({
                          buttonSelectMonth: false,
                          valueYear:undefined,
                          filter: 1,
                          buttonSelectDate: true,
                          selectCalendar: {
                            date: dateConvert,
                            month: monthConvert,
                            year: moment().year(),
                          },
                        })
                        : null;
                    }}
                    style={styles.buttonFilter}>
                    {state?.filter == 1 && <View style={styles.active}></View>}

                    <Text style={styles.textFilter}>Ngày</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      state?.filter !== 2
                        ? setState({
                          buttonSelectMonth: true,
                          valueYear:undefined,
                          filter: 2,
                          buttonSelectDate: false,
                          selectCalendar: {
                            date: dateConvert,
                            month: monthConvert,
                            year: moment().year(),
                          },
                        })
                        : null;
                    }}
                    style={styles.buttonFilter}>
                    {state?.filter == 2 && <View style={styles.active}></View>}
                    <Text style={styles.textFilter}>Tháng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      state?.filter !== 3
                        ? setState({
                          buttonSelectMonth: false,
                          filter: 3,
                          buttonSelectDate: false,
                          selectCalendar: {
                            date: dateConvert,
                            month: monthConvert,
                            year: moment().year(),
                          },
                        })
                        : null;
                    }}
                    style={styles.buttonFilter}>
                    {state?.filter == 3 && <View style={styles.active}></View>}
                    <Text style={styles.textFilter}>Năm</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.flex}>
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 23 }}>
                  Tổng tiền :{' '}
                </Text>
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 23 }}>
                  {sum?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                </Text>
              </View>

              <View style={{ flexDirection: 'column' }}>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                    }}>
                    <TouchableOpacity
                      onPress={() => today()}
                      style={{
                        backgroundColor: '#009900',
                        paddingVertical: 5,
                        marginLeft: 5,
                        width: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '500',
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Hôm nay
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => apply()}
                      style={{
                        backgroundColor: 'blue',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginLeft: 5,
                        width: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '500',
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Chọn
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.calendar}>
              {state?.filter !== 3 && (
                <View style={[styles.flex, styles.titleMonth]}>
                  <View style={[styles.flex]}>
                    <TouchableOpacity
                      onPress={() =>
                        setState({
                          selectCalendar: {
                            date:
                              state?.selectCalendar?.month == monthConvert &&
                                state?.selectCalendar?.year == moment().year()
                                ? dateConvert
                                : undefined,
                            month: '01',
                            year: Number(state?.selectCalendar?.year) - 1,
                          },
                        })
                      }>
                      <AntDesign name="doubleleft" style={styles.doubleleft} />
                    </TouchableOpacity>
                    {state?.buttonSelectMonth == false && (
                      <TouchableOpacity
                        onPress={() =>
                          setState({
                            selectCalendar: {
                              date:
                                state?.selectCalendar?.month == monthConvert &&
                                  state?.selectCalendar?.year == moment().year()
                                  ? dateConvert
                                  : undefined,
                              month:
                                Number(state?.selectCalendar.month) == 1
                                  ? '12'
                                  : `${String(
                                    Number(state?.selectCalendar?.month) -
                                    1,
                                  ).length <= 1
                                    ? `0${Number(
                                      state?.selectCalendar?.month,
                                    ) - 1
                                    }`
                                    : Number(state?.selectCalendar?.month) -
                                    1
                                  }`,
                              year:
                                Number(state?.selectCalendar?.month) == 1
                                  ? Number(moment().year()) - 1
                                  : state?.selectCalendar?.year,
                            },
                            // buttonSelectDate:!state?.buttonSelectDate
                          })
                        }>
                        <AntDesign
                          name="left"
                          style={[
                            styles.left,
                            {
                              paddingLeft:
                                state?.buttonSelectMonth == false ? 40 : 0,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text style={styles.textDay}>
                    Th
                    {state?.selectCalendar?.month} {state?.selectCalendar?.year}
                  </Text>

                  <View style={[styles.flex]}>
                    {state?.buttonSelectMonth == false && (
                      <TouchableOpacity
                        disabled={
                          state?.selectCalendar?.month == monthConvert &&
                            state?.selectCalendar?.year == moment().year()
                            ? true
                            : false
                        }
                        onPress={() =>
                          setState({
                            selectCalendar: {
                              date:
                                state?.selectCalendar?.month == monthConvert &&
                                  state?.selectCalendar?.year == moment().year()
                                  ? dateConvert
                                  : undefined,
                              month:
                                state?.selectCalendar.month == 12
                                  ? '01'
                                  : `${String(
                                    Number(state?.selectCalendar?.month) +
                                    1,
                                  ).length <= 1
                                    ? `0${Number(
                                      state?.selectCalendar?.month,
                                    ) + 1
                                    }`
                                    : Number(state?.selectCalendar?.month) +
                                    1
                                  }`,
                              year:
                                Number(state?.selectCalendar?.month) == 12
                                  ? Number(state?.selectCalendar?.year) + 1
                                  : state?.selectCalendar?.year,
                            },
                          })
                        }>
                        <AntDesign
                          name="right"
                          style={[
                            styles.right,
                            {
                              color:
                                state?.selectCalendar?.month == monthConvert &&
                                  state?.selectCalendar?.year == moment().year()
                                  ? '#dddddd'
                                  : '#303E65',
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      disabled={
                        state?.selectCalendar?.month == monthConvert &&
                          state?.selectCalendar?.year == moment().year()
                          ? true
                          : false
                      }
                      onPress={() =>
                        setState({
                          selectCalendar: {
                            date:
                              state?.selectCalendar?.month == monthConvert &&
                                state?.selectCalendar?.year == moment().year()
                                ? dateConvert
                                : undefined,
                            month: '01',
                            year: Number(state?.selectCalendar?.year) + 1,
                          },
                        })
                      }>
                      <AntDesign
                        name="doubleright"
                        style={[
                          styles.doubleright,
                          {
                            paddingLeft:
                              state?.buttonSelectMonth == true ? 0 : 40,
                            color:
                              state?.selectCalendar?.month == monthConvert &&
                                state?.selectCalendar?.year == moment().year()
                                ? '#dddddd'
                                : '#303E65',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View
                style={{ width: '100%', height: '100%' }}
                onTouchEndCapture={() =>
               undefined && console.log('3e2w')
                }>
                {state?.buttonSelectMonth == true ? (
                  <Animated.View
                    style={[
                      {
                        transform: [{ scale: fadeAnim }],
                      },
                    ]}>
                    <View style={[styles.flex]}>
                      <FlatGrid
                        data={monthFor}
                        renderItem={({ item }: any) => (
                          <TouchableOpacity
                            style={[
                              {
                                padding: 20,
                                borderColor: '#dddddd',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor:
                                  item == state?.selectCalendar?.month
                                    ? 'red'
                                    : '#fff',
                                borderRadius: 100,
                              },
                            ]}
                            onPress={() =>
                              setState({
                                selectCalendar: {
                                  date: undefined,
                                  month: `${String(item).length <= 1 ? `0${item}` : item
                                    }`,
                                  year: state?.selectCalendar?.year,
                                },
                              })
                            }>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: '600',
                                color:
                                  item == state?.selectCalendar?.month
                                    ? '#fff'
                                    : 'black',
                              }}>
                              Th{item}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </Animated.View>
                ) : state?.buttonSelectDate == true ? (
                  state?.monthSelect?.map((item: any, index: any) => {
                    return (
                      <Animated.View
                        style={[
                          {
                            transform: [{ scale: fadeAnim1 }],
                          },
                        ]}>
                        <View
                          style={[
                            styles.flex,
                            {
                              justifyContent: 'space-around',
                              padding: 20,
                              borderBottomWidth:
                                state?.monthSelect[
                                  state?.monthSelect.length - 1
                                ] == index
                                  ? 0
                                  : 1,
                              borderColor: '#dddddd',
                            },
                          ]}>
                          {item.map((itemDate: any) => {
                            return (
                              <TouchableOpacity
                                onPress={() =>
                                  setState({
                                    selectCalendar: {
                                      date: itemDate?.slice(0, 2),
                                      month: itemDate?.slice(3, 5),
                                      year: itemDate?.slice(6, 11),
                                    },
                                  })
                                }>
                                <Text
                                  style={[
                                    {
                                      fontWeight:
                                        itemDate.slice(3, 5) ==
                                          state?.selectCalendar?.month
                                          ? '700'
                                          : '400',
                                      color:
                                        itemDate.slice(3, 5) ==
                                          state?.selectCalendar?.month
                                          ? itemDate.slice(0, 2) ==
                                            state?.selectCalendar?.date &&
                                            itemDate.slice(3, 5) ==
                                            state?.selectCalendar?.month
                                            ? '#fff'
                                            : 'black'
                                          : '#ddddd',
                                      fontSize:
                                        itemDate.slice(3, 5) ==
                                          state?.selectCalendar?.month
                                          ? 22
                                          : 18,
                                      backgroundColor:
                                        itemDate.slice(0, 2) ==
                                          state?.selectCalendar?.date &&
                                          itemDate.slice(3, 5) ==
                                          state?.selectCalendar?.month
                                          ? 'red'
                                          : '#fff',
                                      borderRadius: 100,
                                      padding: 5,
                                    },
                                  ]}>
                                  {itemDate.slice(0, 2)}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </Animated.View>
                    );
                  })
                ) : (
                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Text
                      style={[
                        styles.textEnterYear,
                        {
                          marginBottom: 20,
                          color: 'red',
                          fontWeight: '600',
                        },
                      ]}>
                      Năm nay : {moment().year()}
                    </Text>
                    <Text style={styles.textEnterYear}>Nhập năm : </Text>
                    <TextInput
                      onBlur={() => console.log('first')}
                      style={styles.textEnterYearInput}
                      value={
                        state?.valueYear == undefined ? '' : state?.valueYear
                      }
                      placeholder="Nhập năm muốn tìm order"
                      onChangeText={(e: any) => {
                        startTransition(() => {
                          setState({ valueYear: e });
                        });
                      }}
                    />
                  </KeyboardAvoidingView>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelectDate;

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'relative',
  },
  navigationContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 30,
  },

  input: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 2,
    textAlign: 'center',
    padding: 5,
    color: 'black',
  },
  inputActive: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    padding: 5,
  },
  listMonth: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFilter: {
    borderColor: '#33CCFF',
    borderWidth: 0.7,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 7,
    elevation: 10,
    shadowColor: '#FF9966',
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    color: '#303E65',
    fontWeight: '500',
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderColor: '#303E65',
  },
  textFilter: {
    fontSize: 18,
    color: '#303E65',
    fontWeight: '400',
  },
  active: {
    position: 'absolute',
    top: 2,
    height: 10,
    width: 10,
    right: 2,
    backgroundColor: 'red',
    borderRadius: 100,
  },

  doubleleft: {
    fontSize: 20,
    color: '#303E65',
    fontWeight: '400',
  },
  left: {
    fontSize: 20,
    color: '#303E65',
    fontWeight: '400',
  },
  doubleright: {
    fontSize: 20,
    fontWeight: '400',
  },
  textDay: {
    fontSize: 20,
    color: '#303E65',
    fontWeight: '500',
  },
  right: {
    fontSize: 20,
    fontWeight: '400',
  },
  titleMonth: {
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 0.6,
    borderColor: '#dddddd',
    paddingBottom: 8,
  },
  calendar: {
    width: '60%',
    marginLeft: 20,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderColor: '#dddddd',
    borderWidth: 1,
    padding: 10,
  },
  textEnterYear: {
    fontSize: 20,
    color: '#303E65',
    fontWeight: '400',
  },
  textEnterYearInput: {
    borderRadius: 3,
    borderColor: '#dddddd',
    borderWidth: 1,
    marginTop: 5,
    padding: 5,
  },
});
