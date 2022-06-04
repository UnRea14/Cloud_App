import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import  {server_url} from './server_info'


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
            <TouchableOpacity key={i} onPress={() => navigation.navigate('Image', {user_ID: user_ID, Filename: filename})} >
            <ImageBackground source={require('./facebook.png')} style={styles.image}>
            </ImageBackground>
          </TouchableOpacity>
          );
        }
      return views;
      }


    return (
      <View style={styles.regform}>
        <ScrollView>
            {renderButtons()}
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    image:{
      width: 150,
      height: 50,
      resizeMode: 'stretch',
      padding: 10,
      margin: 5
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
    },
    regform:{
        alignSelf: "stretch",
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
  });