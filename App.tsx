import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Router from './src/Router';

export default function App() {
  return (
    <>
      <Router />
    </>
  );
}
