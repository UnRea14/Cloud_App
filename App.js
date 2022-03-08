import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/components/HomeScreen'
import RegisterScreen from './app/components/RegisterScreen'
import LoginScreen from './app/components/LoginScreen'

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  home: {
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