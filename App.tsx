import { Text, View, LogBox } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Router from './src/Router';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
export default function App() {
  return (
    <>
      <Router />
    </>
  );
}
