import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/components/HomeScreen'
import RegisterScreen from './app/components/RegisterScreen'
import LoginScreen from './app/components/LoginScreen'
import LoginSuccessScreen from './app/components/LoginSuccessScreen'

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const Stack = createNativeStackNavigator();
