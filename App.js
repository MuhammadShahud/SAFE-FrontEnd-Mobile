import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from './src/navigation/Mystack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { Settings } from 'react-native-fbsdk-next';
Settings.initializeSDK();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
