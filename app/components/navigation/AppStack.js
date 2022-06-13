import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ImageNav from '../navigation/ImageNav';
import SettingsScreen from '../screens/UserSettingsScreen';

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
    return (
        <Tab.Navigator>
          <Tab.Screen name="FilesNav" component={ImageNav} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      );
};

export default AppStack;