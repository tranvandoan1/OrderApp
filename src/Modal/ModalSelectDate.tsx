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
import { SizeScale } from '../Component/size';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FlatGrid } from 'react-native-super-grid';
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
  monthFor: any;
};
const month = [
  { id: 1, month: '1', sum: 0 },
  { id: 2, month: '2', sum: 0 },
  { id: 3, month: '3', sum: 0 },
  { id: 4, month: '4', sum: 0 },
  { id: 5, month: '5', sum: 0 },
  { id: 6, month: '6', sum: 0 },
  { id: 7, month: '7', sum: 0 },
  { id: 8, month: '8', sum: 0 },
  { id: 9, month: '9', sum: 0 },
  { id: 10, month: '10', sum: 0 },
  { id: 11, month: '11', sum: 0 },
  { id: 12, month: '12', sum: 0 },
]
const ModalSelectDate: React.FC<Props> = ({
  selectDateProps,
  hiddenSelectDate,
  dataOrders,
  textLanguage,
  background,
  dataTime,
}) => {
  const widthScale = SizeScale().width;

  const monthConvert = `${String(moment().month() + 1).length == 1
    ? `0${moment().month() + 1}`
    : moment().month() + 1
    }`;
  const dateConvert = `${String(moment().date()).length == 1
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
        date: dateConvert,
        month: monthConvert,
        year: moment().year(),
      },
      monthFor: month,
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
    if (conditions({ dataItem: item, today: false })) {
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
      if (conditions({ dataItem: item, today: true })) {
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
        date:
          // nếu trường hợp prev tháng lớn hơn tháng thiện tại thì prev thêm lần nữa sẽ lấy ngày hiện tại và nếu trường hợp next tháng bé hơn tháng thiện tại thì next thêm lần nữa sẽ lấy ngày hiện
          a == 1
            ? Number(state?.selectCalendar?.month) - 1 == Number(monthConvert)
              ? dateConvert
              : undefined
            : Number(state?.selectCalendar?.month) + 1 == Number(monthConvert)
              ? dateConvert
              : undefined,
        month:
          a == 1
            ? Number(state?.selectCalendar.month) == 1
              ? '12'
              : `${String(Number(state?.selectCalendar?.month) - 1).length <= 1
                ? `0${Number(state?.selectCalendar?.month) - 1}`
                : Number(state?.selectCalendar?.month) - 1
              }`
            : state?.selectCalendar.month == 12
              ? '01'
              : `${String(Number(state?.selectCalendar?.month) + 1).length <= 1
                ? `0${Number(state?.selectCalendar?.month) + 1}`
                : Number(state?.selectCalendar?.month) + 1
              }`,
        year:
          a == 1
            ? Number(state?.selectCalendar?.month) == 1
              ? Number(state?.selectCalendar?.year) - 1
              : state?.selectCalendar?.year
            : Number(state?.selectCalendar?.month) == 12
              ? Number(state?.selectCalendar?.year) + 1
              : state?.selectCalendar?.year,
      },
    });
  };
  console.log(state?.monthFor, '3r2ewd')
  // render tháng
  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        // disabled={
        //   Number(item.month) > Number(state?.selectCalendar?.month)
        //     ? true
        //     : false
        // }
        style={[
          {
            paddingVertical: widthScale * 60,
            borderColor: '#dddddd',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor:
              Number(item.month) == Number(state?.selectCalendar?.month)
                ? 'red'
                : Number(item.month) > Number(monthConvert) &&
                  state?.selectCalendar.year == moment().year()
                  ? '#BBBBBB'
                  : item.sum > 0
                    ? '#009900'
                    : '#fff',
            borderRadius: 20,
          },
        ]}
        onPress={() =>
          setState({
            selectCalendar: {
              date: undefined,
              month: `${String(item.month).length <= 1 ? `0${item.month}` : item.month
                }`,
              year: state?.selectCalendar?.year,
            },
          })
        }>
        { }
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color:
              Number(item.month) == Number(state?.selectCalendar?.month) ||
                item.sum > 0
                ? '#fff'
                : Number(item.month) > Number(monthConvert) &&
                  state?.selectCalendar.year == moment().year()
                  ? '#EEEEEE'
                  : 'black',
          }}>
          Th {item.month}
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
    // lấy những order trong tháng đã chọn
    const dataOrder = dataOrders?.filter((item: any) => {
      const time = new Date(item.createdAt);
      if (
        state?.filterStatusTime == 1
          ? Number(time?.getMonth() + 1) ==
          Number(state?.selectCalendar?.month) &&
          time.getFullYear() == state?.selectCalendar?.year
          : time.getFullYear() == state?.selectCalendar?.year
      ) {
        return item;
      }
    });
    // //  nhóm những order cùng ngày vào 1 nhóm
    const grouped = dataOrder.reduce((acc: any, curr: any) => {
      const timeAcc = new Date(curr.createdAt);
      const existing = acc.find((item: any) => {
        const timeCurr: any = new Date(item?.key);
        return state?.filterStatusTime == 1
          ? timeAcc?.getDate() === timeCurr?.getDate()
          : timeAcc?.getMonth() + 1 === timeCurr?.getMonth() + 1;
      });
      if (existing) {
        existing.values.push(curr);
      } else {
        acc.push({ key: timeAcc, values: [curr] });
      }
      return acc;
    }, []);
    console.log(grouped, '3ewds')
    for (let j = 0; j < grouped.length; j++) {
      for (
        let i = 0;
        i <
        (state?.filterStatusTime == 1
          ? dataMonthSelet.length
          : state?.monthFor.length);
        i++
      ) {
        const time = new Date(grouped[j].key);
        if (
          state?.filterStatusTime == 1
            ? dataMonthSelet[i].date == time.getDate()
            : Number(state?.monthFor[i].month) == Number(time.getMonth() + 1)
        ) {
          console.log('có vào')
          let sum = 0;
          // tính tổng tiền
          for (let e = 0; e < grouped[j].values.length; e++) {
            sum += Math.ceil(
              grouped[j].values[e].sumPrice *
              ((100 - grouped[j].values[e].sale) / 100),
            );
          }
          state?.filterStatusTime == 1
            ? (dataMonthSelet[i].sum = sum)
            : (state.monthFor[i].sum = sum);
        } else {
          state?.filterStatusTime == 1
            ? (dataMonthSelet[i].sum = 0)
            : (state.monthFor[i].sum = 0);
        }
      }
    }
    state?.filterStatusTime == 1
      ? setOrder(dataMonthSelet)
      : setState({ monthFor: grouped?.length <= 0 ? month : state.monthFor });
  }, [state?.selectCalendar, state?.monthSelect, state?.filterStatusTime, state?.monthFor]);
  // render lịch tháng
  const filterOrder = () => {
    return (
      <Animated.View
        style={[
          {
            transform: [{ scale: fadeAnim1 }],
          },
        ]}>
        <FlatGrid
          data={orders}
          itemDimension={40}
          // @ts-ignore
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <View
                style={[
                  styles.flex,
                  {
                    justifyContent: 'space-around',
                    paddingVertical: widthScale * 20,
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
                          Number(item.date) ==
                            Number(state?.selectCalendar?.date) &&
                            Number(item.month) ==
                            Number(state?.selectCalendar?.month) &&
                            item.year ==
                            moment().year()
                            ? '#fff'
                            : item?.sum > 0
                              ? '#fff'
                              : 'black',
                        fontSize:
                          item.month == state?.selectCalendar?.month ? 22 : 18,
                        backgroundColor:
                          Number(item.date) ==
                            Number(state?.selectCalendar?.date) &&
                            Number(item.month) ==
                            Number(state?.selectCalendar?.month) &&
                            item.year ==
                            moment().year()
                            ? 'red'
                            : item?.sum > 0
                              ? '#009900'
                              : '#fff',
                        borderRadius: 10,
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
          <View style={{ flexDirection: 'row', width: '100%', height: '100%' }}>
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
                            date: dateConvert,
                            month: monthConvert,
                            year: moment().year(),
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
                            date: moment().date(),
                            month: monthConvert,
                            year: moment().year(),
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
                            date: dateConvert,
                            month: monthConvert,
                            year: moment().year(),
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
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 23 }}>
                  {textLanguage?.total_money} :{' '}
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
                        {state.filterStatusTime == 1
                          ? textLanguage?.today
                          : state.filterStatusTime == 2
                            ? textLanguage?.this_month
                            : textLanguage.this_year}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        state?.filterStatusTime == 1 &&
                          state?.selectCalendar?.date == undefined
                          ? true
                          : false
                      }
                      onPress={() => apply()}
                      style={{
                        backgroundColor:
                          state?.filterStatusTime == 1 &&
                            state?.selectCalendar?.date == undefined
                            ? '#dddd'
                            : 'blue',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginLeft: 5,
                        width: '50%',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: '500',
                          color:
                            state?.filterStatusTime == 1 &&
                              state?.selectCalendar?.date == undefined
                              ? '#BBBBBB'
                              : '#fff',
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
                            date: undefined,
                            month: state?.filterStatusTime == 1 ? 1 : undefined,
                            year: Number(state?.selectCalendar?.year) - 1,
                          },
                          monthFor: month
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
                              color: Number(state?.selectCalendar.month - 1) == Number(monthConvert) && state?.selectCalendar.year == moment().year() ? '#303E65' : '#dddddd',
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
                    {state?.filterStatusTime == 1 &&
                      `Th ${state?.selectCalendar?.month}`}{' '}
                    {state?.selectCalendar?.year}
                  </Text>

                  {/* next tháng */}

                  <View style={[styles.flex]}>
                    {state?.buttonSelectMonth == false && (
                      <TouchableOpacity
                        disabled={
                          Number(state?.selectCalendar?.month) ==
                            Number(moment().month() + 1) &&
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
                              color: Number(state?.selectCalendar.month) == Number(monthConvert) && state?.selectCalendar?.year == moment().year() ? '#303E65' : '#dddddd',
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      disabled={
                        state?.selectCalendar?.year == moment().year() &&
                          background == 2
                          ? true
                          : false
                      }
                      onPress={() =>
                        setState({
                          selectCalendar: {
                            date: undefined,
                            month: state?.filterStatusTime == 1 ? 1 : undefined,
                            year: Number(state?.selectCalendar?.year) + 1,
                          },
                          monthFor: month
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
                              state?.selectCalendar?.year == moment().year() &&
                                background == 2
                                ? '#303E65'
                                : '#dddddd',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={{ width: '100%', height: '100%' }}>
                {state?.buttonSelectMonth == true ? (
                  <Animated.View
                    style={[
                      {
                        transform: [{ scale: fadeAnim }],
                      },
                    ]}>
                    <View style={[styles.flex, { overflow: 'hidden' }]}>
                      <FlatGrid
                        data={state?.monthFor}
                        itemDimension={80}
                        // @ts-ignore
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }: any) => renderItem(item)}
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
                        style={styles.textEnterYearInput}
                        value={
                          state?.valueYear == undefined ? '' : state?.valueYear
                        }
                        placeholder={`${textLanguage?.enter_order}`}
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
    overflow: 'hidden'
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
