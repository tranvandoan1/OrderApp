import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../App/Store';
import {getAll} from '../Features/FloorSlice';

const Floor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;
  const floors = useAppSelect((data: any) => data.floors.value);
  useEffect(() => {
    dispatch(getAll());
  }, []);
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
          marginTop: 20,
          color: 'red',
          fontWeight: '500',
        }}>
        Bạn muốn vào tầng mấy ?
      </Text>
      {floors.length <= 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <View
          style={{flexDirection: 'row', paddingHorizontal: 20, marginTop: 20}}>
          {floors.map((item: any) => {
            return (
              <TouchableOpacity style={styles.floor}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Floor;

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  floor: {
    borderColor: 'rgb(219, 219, 219)',
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 3,
  },
});
