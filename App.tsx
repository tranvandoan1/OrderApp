import { LogBox } from 'react-native';
import * as React from 'react';
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
