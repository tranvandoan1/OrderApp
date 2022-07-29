// In App.js in a new project
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/EvilIcons';

import Manage from './Manage/Manage';
import Order from './Order/Order';
import Signin from './Login/Signin';
import SignUp from './Login/SignUp';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListProducts from './Manage/Products/ListProducts';
import {store} from './App/Store';
import {Provider} from 'react-redux';
import ListCate from './Manage/Categoris/ListCate';
const Tab = createBottomTabNavigator();

function Router() {
  const [checkUser, setCheckUser] = React.useState<any>();
  useEffect(() => {
    async function checkUser() {
      const logStorage: any = await AsyncStorage.getItem('user');
      const user = JSON.parse(logStorage);
      setInterval(() => {
        setCheckUser(user.data);
      }, 2000);
    }
    checkUser();
  }, []);
  return (
    <>
      {checkUser == undefined ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={'blue'} />
        </View>
      ) : (
        <Tab.Navigator screenOptions={({route}) => ({})}>
          <Tab.Screen
            name="Order"
            component={Order}
            options={{
              headerShown: false,
              tabBarIcon: () => <View></View>,
              tabBarActiveBackgroundColor: 'tomato',
              tabBarLabel: ({focused, color}) => (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Icon
                    name="cart"
                    size={26}
                    style={{color: focused ? '#fff' : 'tomato'}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: focused ? '#fff' : 'tomato',
                    }}>
                    Gọi món
                  </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="manage"
            component={Manage}
            options={{
              headerShown: false,
              tabBarIcon: () => <View></View>,
              tabBarActiveBackgroundColor: 'tomato',
              tabBarLabel: ({focused, color}) => (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Icons
                    name="user"
                    size={26}
                    style={{color: focused ? '#fff' : 'tomato'}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: focused ? '#fff' : 'tomato',
                      fontWeight: '600',
                    }}>
                    Quản lý
                  </Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
}
const Stack = createNativeStackNavigator();
function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Signin"
              component={Signin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={SignUp}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Router}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="list-product"
              component={ListProducts}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="categoris"
              component={ListCate}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
const styles = StyleSheet.create({
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});
export default App;
