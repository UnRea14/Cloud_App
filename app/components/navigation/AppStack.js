import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageNav from '../navigation/ImageNav';
import SettingsScreen from '../screens/UserSettingsScreen';
import ImageScreen from '../screens/ImageScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen name="FilesNav" component={ImageNav} options={{headerShown: false}} />
          <Stack.Screen name="Image" component={ImageScreen}  options={{headerShown: false}} />
        </Stack.Navigator>
      );
};

export default AppStack;