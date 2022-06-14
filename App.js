import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Provider} from 'react-native-paper'
import { AuthProvider } from './app/context/AuthContext';
import AppNav from './app/navigation/AppNav';


export default function App() {
  return (
    <AuthProvider>
      <Provider>
        <AppNav/>
      </Provider>
    </AuthProvider>
  );
}
const Stack = createNativeStackNavigator();
