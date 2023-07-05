import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useEffect,
  useRef,
  useReducer,
  startTransition,
  useState,
} from 'react';
import {SizeScale} from '../Component/size';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatGrid} from 'react-native-super-grid';
type Props = {
  selectDateProps: any;
  hiddenSelectDate: (e: any) => void;
  dataOrders: any;
  textLanguage: any;
  background: any;
  dataTime: any;
};
type State = {
  buttonSelectMonth: boolean;
  buttonSelectDate: boolean;
  filterStatusTime: number;
  valueYear: any;
  monthSelect: any;
  selectCalendar: any;
};
const ModalSelectDate: React.FC<Props> = ({
  selectDateProps,
  hiddenSelectDate,
  dataOrders,
  textLanguage,
  background,
  dataTime,
}) => {
  const widthScale = SizeScale().width;

  const monthConvert = `${
    String(moment().month() + 1).length == 1
      ? `0${moment().month() + 1}`
      : moment().month() + 1
  }`;
  const dateConvert = `${
    String(moment().date()).length == 1
      ? `0${moment().date()}`
      : moment().date()
  }`;
  const [state, setState] = useReducer(
    (state: State, newState: Partial<State>) => ({
      ...state,
      ...newState,
    }),
    {
      buttonSelectMonth: dataTime?.filterStatusTime == 2 ? true : false, //hiện tháng để chọn
      buttonSelectDate:
        dataTime?.filterStatusTime == 1 ||
        dataTime?.filterStatusTime == undefined
          ? true
          : false, //hiện ngày để chọn
      filterStatusTime:
        dataTime?.filterStatusTime == undefined
          ? 1
          : dataTime?.filterStatusTime, //ấn button chọn lọc theo ngày, tháng, năm
      // selectDay: undefined, //chọn ngày
      monthSelect: undefined, //lưu ngày trong tháng
      valueYear: undefined,
      selectCalendar: {
        //lưu giá trị tháng năm khi ấn next hoặc prev
        date: dataTime.date.date,
        month: dataTime.date.month,
        year: dataTime.date.year,
      },
    },
  );

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
      let time: any = `${
        datanew?.length <= 0
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
    setState({monthSelect: newDataMonth});
  };
  useEffect(() => {
    getWeekMonth();
  }, [state?.selectCalendar]);
  // kiều kiện để lấy ra được nhưng order theo ý chọn
  const conditions = (item: any) => {
    const time = new Date(item.dataItem.updatedAt);
    return state?.filterStatusTime == 1
      ? Number(time.getDate()) ==
          Number(
            item.today == true ? dateConvert : state?.selectCalendar?.date,
          ) &&
          Number(time.getMonth() + 1) ==
            Number(
              item.today == true ? monthConvert : state?.selectCalendar?.month,
            ) &&
          time.getFullYear() == moment().year()
      : state?.filterStatusTime == 2
      ? Number(time.getMonth() + 1) ==
          Number(
            item.today == true ? monthConvert : state?.selectCalendar?.month,
          ) &&
        time.getFullYear() ==
          Number(
            item.today == true ? moment().year() : state?.selectCalendar?.year,
          )
      : time.getFullYear() ==
        (state?.valueYear == undefined || String(state?.valueYear).length <= 0
          ? moment().year()
          : state?.valueYear);
  };
  // lọc order
  const dataProps: any = [];
  dataOrders?.map((item: any) => {
    if (conditions({dataItem: item, today: false})) {
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
      filterStatusTime: state?.filterStatusTime,
    });
  };

  // chọn ngày hôm nay
  const today = () => {
    setState({
      selectCalendar: {
        date: dataTime.date.date,
        month: dataTime.date.month,
        year: dataTime.date.year,
      },
    });
    const dataProps: any = [];
    dataOrders?.map((item: any) => {
      if (conditions({dataItem: item, today: true})) {
        dataProps.push(item);
      }
    });
    let sum = 0;
    for (let i = 0; i < dataProps.length; i++) {
      sum += Math.ceil(
        dataProps[i].sumPrice * ((100 - dataProps[i].sale) / 100),
      );
    }
    hiddenSelectDate({
      sum: sum,
      date: {
        date: dateConvert,
        month: monthConvert,
        year: moment().year(),
      },
      filterStatusTime: state?.filterStatusTime,
      data: dataProps,
    });
  };

  // chọn tháng
  const setNextPrevTime = (a: any) => {
    setState({
      selectCalendar: {
        date: dataTime.date.date,
        month:
          a == 1
            ? Number(state?.selectCalendar.month) == 1
              ? '12'
              : `${
                  String(Number(state?.selectCalendar?.month) - 1).length <= 1
                    ? `0${Number(state?.selectCalendar?.month) - 1}`
                    : Number(state?.selectCalendar?.month) - 1
                }`
            : state?.selectCalendar.month == 12
            ? '01'
            : `${
                String(Number(state?.selectCalendar?.month) + 1).length <= 1
                  ? `0${Number(state?.selectCalendar?.month) + 1}`
                  : Number(state?.selectCalendar?.month) + 1
              }`,
        year:
          Number(state?.selectCalendar?.month) == 12
            ? Number(state?.selectCalendar?.year) + 1
            : state?.selectCalendar?.year,
      },
    });
  };

  // render tháng
  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        style={[
          {
            padding: 20,
            borderColor: '#dddddd',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor:
              item == state?.selectCalendar?.month ? 'red' : '#fff',
            borderRadius: 100,
          },
        ]}
        onPress={() =>
          setState({
            selectCalendar: {
              date: undefined,
              month: `${String(item).length <= 1 ? `0${item}` : item}`,
              year: state?.selectCalendar?.year,
            },
          })
        }>
        {}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: item == state?.selectCalendar?.month ? '#fff' : 'black',
          }}>
          Th{item}
        </Text>
      </TouchableOpacity>
    );
  };

  // lọc order để hiển thị những ngày có bill
  const [orders, setOrder] = useState<any>();

  useEffect(() => {
    // lấy nhưng order theo tháng hoặc năm
    const dataMonthSelet: any = [];
    state?.monthSelect?.map((item: any) => {
      item?.map((itemData: any) => {
        dataMonthSelet.push({
          date: itemData.slice(0, 2),
          month: itemData.slice(3, 5),
          year: itemData.slice(6, 10),
          sum: 0,
        });
      });
    });
    console.log(state?.monthSelect, 'dataMonthSelet');
    const dataOrder = dataOrders?.filter((item: any) => {
      const time = new Date(item.createdAt);
      if (
        state?.selectCalendar?.date == undefined
          ? time.getFullYear() == state?.selectCalendar?.year
          : Number(time?.getMonth() + 1) == state?.selectCalendar?.month &&
            time.getFullYear() == state?.selectCalendar?.year
      ) {
        // setOrder(item)
        return item;
      }
    });
    //  nhóm những order cùng ngày vào 1 nhóm
    const grouped = dataOrder.reduce((acc: any, curr: any) => {
      const timeAcc = new Date(curr.createdAt);
      const existing = acc.find((item: any) => {
        const timeCurr: any = new Date(item?.key);
        return timeAcc?.getDate() === timeCurr?.getDate();
      });
      if (existing) {
        existing.values.push(curr);
      } else {
        acc.push({key: timeAcc, values: [curr]});
      }
      return acc;
    }, []);

    for (let j = 0; j < grouped.length; j++) {
      for (let i = 0; i < dataMonthSelet.length; i++) {
        const time = new Date(grouped[j].key);
        if (dataMonthSelet[i].date == time.getDate()) {
          let sum = 0;
          for (let e = 0; e < grouped[j].values.length; e++) {
            sum += Math.ceil(
              grouped[j].values[e].sumPrice *
                ((100 - grouped[j].values[e].sale) / 100),
            );
          }
          dataMonthSelet[i].sum = sum;
        }
      }
    }
    setOrder(dataMonthSelet);
  }, [state?.selectCalendar, state?.monthSelect]);
  const filterOrder = () => {
    return (
      <Animated.View
        style={[
          {
            transform: [{scale: fadeAnim1}],
          },
        ]}>
        <FlatGrid
          data={orders}
          itemDimension={40}
          // @ts-ignore
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}: any) => {
            return (
              <View
                style={[
                  styles.flex,
                  {
                    justifyContent: 'space-around',
                    paddingVertical: widthScale * 20,
                    // borderBottomWidth:
                    //   state?.monthSelect.length - 1 == index
                    //     ? 0
                    //     : 0.5,
                    // borderColor: '#dddddd',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    setState({
                      selectCalendar: {
                        date: item.date,
                        month: item.month,
                        year: item.year,
                      },
                    })
                  }>
                  <Text
                    style={[
                      {
                        fontWeight:
                          item.month == state?.selectCalendar?.month
                            ? '700'
                            : '400',
                        color:
                          item.date == state?.selectCalendar?.date &&
                          item.month == state?.selectCalendar?.month
                            ? monthConvert == state?.selectCalendar?.month
                              ? '#fff'
                              : 'black'
                            : item?.sum > 0
                            ? '#fff'
                            : 'black',
                        fontSize:
                          item.month == state?.selectCalendar?.month ? 22 : 18,
                        backgroundColor:
                          item.date == state?.selectCalendar?.date &&
                          item.month == state?.selectCalendar?.month
                            ? monthConvert !== state?.selectCalendar?.month
                              ? '#fff'
                              : 'red'
                            : item?.sum > 0
                            ? 'blue'
                            : '#fff',
                        borderRadius: 100,
                        padding: 5,
                      },
                    ]}>
                    {item.date}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </Animated.View>
    );
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
              width: widthScale * 1000,
              backgroundColor: background == 2 ? 'black' : '#fff',
              height: 510,
              borderWidth: 0.5,
              borderColor: '#fff',
            },
          ]}>
          <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
            <View
              style={{
                width: '40%',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.title}>{textLanguage?.choose_by}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      state?.filterStatusTime !== 1
                        ? setState({
                            buttonSelectMonth: false,
                            valueYear: undefined,
                            filterStatusTime: 1,
                            buttonSelectDate: true,
                            selectCalendar: {
                              date: dataTime.date.date,
                              month: dataTime.date.month,
                              year: dataTime.date.year,
                            },
                          })
                        : null;
                    }}
                    style={styles.buttonFilter}>
                    {state?.filterStatusTime == 1 && (
                      <View style={styles.active}></View>
                    )}

                    <Text style={styles.textFilter}>{textLanguage?.date}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      state?.filterStatusTime !== 2
                        ? setState({
                            buttonSelectMonth: true,
                            valueYear: undefined,
                            filterStatusTime: 2,
                            buttonSelectDate: false,
                            selectCalendar: {
                              date: dataTime.date.date,
                              month: dataTime.date.month,
                              year: dataTime.date.year,
                            },
                          })
                        : null;
                    }}
                    style={styles.buttonFilter}>
                    {state?.filterStatusTime == 2 && (
                      <View style={styles.active}></View>
                    )}
                    <Text style={styles.textFilter}>{textLanguage?.month}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      state?.filterStatusTime !== 3
                        ? setState({
                            buttonSelectMonth: false,
                            filterStatusTime: 3,
                            buttonSelectDate: false,
                            selectCalendar: {
                              date: dataTime.date.date,
                              month: dataTime.date.month,
                              year: dataTime.date.year,
                            },
                          })
                        : null;
                    }}
                    style={styles.buttonFilter}>
                    {state?.filterStatusTime == 3 && (
                      <View style={styles.active}></View>
                    )}
                    <Text style={styles.textFilter}>{textLanguage?.year}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.flex}>
                <Text style={{color: 'red', fontWeight: '600', fontSize: 23}}>
                  {textLanguage?.total_money} :{' '}
                </Text>
                <Text style={{color: 'red', fontWeight: '600', fontSize: 23}}>
                  {sum?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}đ
                </Text>
              </View>

              <View style={{flexDirection: 'column'}}>
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
                        {state.filterStatusTime == 1
                          ? textLanguage?.today
                          : state.filterStatusTime == 2
                          ? textLanguage?.this_month
                          : textLanguage.this_year}
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
                        {textLanguage?.select}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.calendar}>
              {/* prev tháng */}

              {state?.filterStatusTime !== 3 && (
                <View style={[styles.flex, styles.titleMonth]}>
                  <View style={[styles.flex]}>
                    <TouchableOpacity
                      onPress={() =>
                        setState({
                          selectCalendar: {
                            date: state?.selectCalendar?.date,

                            month: '01',
                            year: Number(state?.selectCalendar?.year) - 1,
                          },
                        })
                      }>
                      <AntDesign
                        name="doubleleft"
                        style={[
                          styles.doubleleft,
                          {
                            color: background == 1 ? '#303E65' : '#dddddd',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    {state?.buttonSelectMonth == false && (
                      <TouchableOpacity onPress={() => setNextPrevTime(1)}>
                        <AntDesign
                          name="left"
                          style={[
                            styles.left,
                            {
                              paddingLeft:
                                state?.buttonSelectMonth == false ? 40 : 0,
                              color: background == 1 ? '#303E65' : '#dddddd',
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.textDay,
                      {
                        color: background == 1 ? '#303E65' : '#dddddd',
                      },
                    ]}>
                    Th
                    {state?.selectCalendar?.month} {state?.selectCalendar?.year}
                  </Text>

                  {/* next tháng */}

                  <View style={[styles.flex]}>
                    {state?.buttonSelectMonth == false && (
                      <TouchableOpacity
                        disabled={
                          state?.selectCalendar?.month == dataTime.date.month &&
                          state?.selectCalendar?.year == moment().year()
                            ? true
                            : false
                        }
                        onPress={() => setNextPrevTime(2)}>
                        <AntDesign
                          name="right"
                          style={[
                            styles.right,
                            {
                              color:
                                state?.selectCalendar?.month ==
                                  dataTime.date.month &&
                                state?.selectCalendar?.year == moment().year()
                                  ? background == 2
                                    ? '#303E65'
                                    : '#dddddd'
                                  : '#303E65',
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      disabled={
                        state?.selectCalendar?.month == dataTime.date.month &&
                        state?.selectCalendar?.year == moment().year()
                          ? true
                          : false
                      }
                      onPress={() =>
                        setState({
                          selectCalendar: {
                            date: state?.selectCalendar?.date,

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
                              state?.selectCalendar?.month ==
                                dataTime.date.month &&
                              state?.selectCalendar?.year == moment().year()
                                ? background == 2
                                  ? '#303E65'
                                  : '#dddddd'
                                : '#303E65',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{width: '100%', height: '100%'}}>
                {state?.buttonSelectMonth == true ? (
                  <Animated.View
                    style={[
                      {
                        transform: [{scale: fadeAnim}],
                      },
                    ]}>
                    <View style={[styles.flex]}>
                      <FlatGrid
                        data={monthFor}
                        itemDimension={100}
                        // @ts-ignore
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}: any) => renderItem(item)}
                      />
                    </View>
                  </Animated.View>
                ) : // {/* lịch chọn ngày */}
                state?.buttonSelectDate == true ? (
                  filterOrder()
                ) : (
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <Text
                      style={[
                        styles.textEnterYear,
                        {
                          marginBottom: 20,
                          color: 'red',
                          fontWeight: '600',
                        },
                      ]}>
                      {textLanguage?.this_year} : {moment().year()}
                    </Text>
                    <Text style={styles.textEnterYear}>
                      {textLanguage?.enter_year} :{' '}
                    </Text>
                    <TextInput
                      // onBlur={() => console.log('first')}
                      style={styles.textEnterYearInput}
                      value={
                        state?.valueYear == undefined ? '' : state?.valueYear
                      }
                      placeholder={`${textLanguage?.enter_order}`}
                      onChangeText={(e: any) => {
                        startTransition(() => {
                          setState({valueYear: e});
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
    fontWeight: '400',
  },
  left: {
    fontSize: 20,
    fontWeight: '400',
  },
  doubleright: {
    fontSize: 20,
    fontWeight: '400',
  },
  textDay: {
    fontSize: 20,
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
    borderWidth: 0.5,
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
