import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView, StatusBar} from 'react-native';
import  {server_url} from './server_info'

//infinite loop in this file causes memory leak

export default function FilesScreen({navigation, route}) {
    const {user_ID} = route.params;
    const [Files, SetFiles] = useState([])
    const [isRendered, SetRendered] = useState(false)

    useEffect(() => {
    fetch(server_url + '/files/' + user_ID)
      .then((response) => response.json())
        .then((json) => SetFiles(json))
    }, []);

    const renderButtons = () => {
      const views = [];
        for ( var i = 0; i < Files.length; i++){
          const filename = Files[i]
          views.push(
            <TouchableOpacity style={styles.button} key={i} onPress={() => {navigation.navigate('Image', {user_ID: user_ID, Filename: filename})}} >
            <ImageBackground source={require('./placeholder.jpg')} style={styles.image}>
              <Text style={styles.buttontext}> {filename} </Text>
            </ImageBackground>
          </TouchableOpacity>
          );
        }
      return views;
      }


    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        <ScrollView >
            {renderButtons()}
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    AndroidSafeArea: {
      flex: 1,
      backgroundColor: "white",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    image:{
      width: 300,
      height: 150,
      resizeMode: 'stretch',
    },
    button: {
        alignItems: "center",
        padding: 10,
        backgroundColor: "grey",
        marginTop: 20,
        
    },
    buttontext:{
        color: "white",
        fontWeight: "bold",
        alignSelf: 'center'
    },
    regform:{
        alignSelf: "stretch",
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
  });