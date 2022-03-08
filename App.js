import React from 'react';
import { render } from 'react-dom';
import { Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Register from './app/components/Register';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <Register />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    paddingLeft: 60,
    paddingRight: 60,
  }
})

