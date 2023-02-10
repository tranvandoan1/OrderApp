import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FilterStatusTable = () => {
  return (
    <View
    style={{
      width: '100%',
      borderColor: 'rgb(219,219,219)',
      borderLeftWidth: 1,
    }}>
    <FlatGrid
      itemDimension={width < 960 ? (width < 539 ? 150 : 150) : 200}
      data={selectTable == undefined ? tables : statusTable}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <View style={[styles.listTable, { zIndex: 1 }]}>
            <TouchableOpacity
              style={styles.table}
              onPress={() => order(item)}
              onLongPress={() => {
                // check xem bàn đó đã gọi món chưa nếu rồi hiện mockup chọn chuyển bàn hoặc hủy
                if (
                  item?.orders?.length > 0 &&
                  (item?.timeBookTable == 'null' ||
                    item?.timeBookTable !== 'null')
                ) {
                  setSelectionTable(item);
                }
              }}
              key={item._id}>
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  flexDirection: 'row',
                  zIndex: 100,
                }}>
                {item.timeBookTable !== 'null' ? (
                  <View
                    key={item}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      backgroundColor: 'red',
                      marginRight: 5,
                    }}></View>
                ) : null}
                {item?.orders?.length > 0 && (
                  <View
                    key={item}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 100,
                      backgroundColor: '#00FF00',
                    }}></View>
                )}
              </View>
              {propParams?.loading == undefined ||
                propParams?.loading == false ? (
                <Image
                  source={require(`../assets/images/table.png`)}
                  style={{
                    width: 100,
                    height: 100,
                    tintColor: 'blue',
                  }}
                />
              ) : propParams?.id == item._id ? (
                <ActivityIndicator
                  size="large"
                  color={'blue'}
                  style={{ width: 100, height: 100 }}
                />
              ) : (
                <Image
                  source={require(`../assets/images/table.png`)}
                  style={{
                    width: 100,
                    height: 100,
                    tintColor: 'blue',
                  }}
                />
              )}
              <Text
                style={[
                  styles.nameTable,
                  { fontSize: width < 960 ? 20 : 21 },
                ]}>
                {item.name}
              </Text>

              <Text
                style={[
                  {
                    fontSize: width < 960 ? 18 : 16,
                    color: '#00CC00',
                    fontWeight: '500',
                  },
                ]}>
                {item.amount > 0 ? (
                  item?.orders?.length > 0 ||
                    item?.orders?.length <= 0 ||
                    item.timeBookTable !== 'null' ? (
                    <Text style={{ color: 'red' }}>
                      {' '}
                      {item.timeBookTable} (
                      {renderBookTable(item?.orders)}đ){' '}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color:
                          item?.orders?.length > 0
                            ? '#00CC00'
                            : 'red',
                      }}>
                      {item?.orders?.length > 0
                        ? `Tổng ${renderBookTable(item?.orders)}đ`
                        : 'Trống'}
                    </Text>
                  )
                ) : (
                  <Text
                    style={{
                      color:
                        item?.orders?.length > 0
                          ? '#00CC00'
                          : 'red',
                    }}>
                    {item?.orders?.length > 0
                      ? `Tổng ${renderBookTable(item?.orders)}đ`
                      : 'Trống'}
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  </View>
  )
}

export default FilterStatusTable

const styles = StyleSheet.create({})