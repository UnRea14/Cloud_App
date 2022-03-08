import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Register from './app/components/Register'

export default function App() {
  return (
    <View style={styles.container}>
      <Register/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    paddingLeft: 60,
    paddingRight: 60,
  }
})