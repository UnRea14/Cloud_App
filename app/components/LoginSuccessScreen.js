import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import UploadFileScreen from './UploadFileScreen'
import SettingsScreen from './UserSettingsScreen'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

export default function LoginHome() {
    return (
        <Tab.Navigator>
          <Tab.Screen name="UploadFile" component={UploadFileScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      );
}

const styles = StyleSheet.create({
    regform: {
        alignSelf: "stretch",
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
    header: {
        fontSize: 24,
        color: "black",
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: "#199187",
        borderBottomWidth: 1,
        textAlign: "center",
        justifyContent: "center"
    },
    button: {
        alignSelf: "stretch",
        alignItems: "center",
        padding: 20,
        backgroundColor: "grey",
        marginTop: 30,
    },
    buttontext:{
        color: "#fff",
        fontWeight: "bold"
    }
})