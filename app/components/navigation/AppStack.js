import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FilesScreen from '../screens/FilesScreen'
import SettingsScreen from '../screens/UserSettingsScreen'

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
    return (
        <Tab.Navigator>
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Files" component={FilesScreen} />
        </Tab.Navigator>
      );
};

export default AppStack;