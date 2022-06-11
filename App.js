import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Provider} from 'react-native-paper'
import HomeScreen from './app/components/HomeScreen'
import RegisterScreen from './app/components/RegisterScreen'
import LoginScreen from './app/components/LoginScreen'
import FilesScreen from './app/components/FilesScreen'
import MainScreen from './app/components/MainScreen'
import ImageScreen from './app/components/ImageScreen'


export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} /> 
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Files" component={FilesScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Image" component={ImageScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
const Stack = createNativeStackNavigator();
