import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './app/components/RegisterSceen'
import LoginScreen from './app/components/LoginScreen'

function HomeScreen({navigation}) {
  return(
      <View style={styles.home}>
          <Text style={styles.header}>Hello</Text>
          <TouchableOpacity style={styles.button}>
              <Text onPress={() => navigation.navigate("Login")} style={styles.buttontext}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
              <Text onPress={() => navigation.navigate("Register")} style={styles.buttontext}>Register</Text>
          </TouchableOpacity>
      </View>
  );
}

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
      justifyContent: "center",
      paddingLeft: 60,
      paddingRight: 60
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