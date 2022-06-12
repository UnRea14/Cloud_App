import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Provider} from 'react-native-paper'
import { AuthContext, AuthProvider } from './app/components/context/AuthContext';
import AppNav from './app/components/navigation/AppNav';


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
