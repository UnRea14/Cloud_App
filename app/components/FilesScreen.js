import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView, StatusBar, View, Alert} from 'react-native';
import  {server_url} from './server_info'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

//infinite loop in this file causes memory leak

export default function FilesScreen({navigation, route}) {
    const {user_ID} = route.params;
    const [Files, SetFiles] = useState([])
    const [updateFiles, setUpdateFiles] = useState(false) //should the files update?
    const [AreFilesUpdated, setAreFilesUpdated] = useState(false)
    const [File, SetFile] = useState(null)


    useEffect(() => {
      fetch(server_url + '/files/' + user_ID)
        .then((response) => response.json())
          .then((json) => SetFiles(json), setUpdateFiles(false), setAreFilesUpdated(true));
    }, [updateFiles]); //only fetches when updateFiles is true


    const renderButtons = () => {
      const views = [];
        for ( var i = 0; i < Files.length; i++){
          const filename = Files[i]
          views.push(
            <TouchableOpacity style={styles.button} key={i} onPress={() => {navigation.navigate('Image', {user_ID: user_ID, Filename: filename, setState: setUpdateFiles})}} >
            <ImageBackground source={require('./placeholder.jpg')} style={styles.image}>
              <Text style={styles.buttontext}> {filename} </Text>
            </ImageBackground>
          </TouchableOpacity>
          );
        }
      return views;
      }


      const UploadFileToServer = async () => {
        if (File != null) {
          const fileToUpload = File;
          const response = await FileSystem.uploadAsync(server_url + '/uploadImage/' + user_ID, fileToUpload.uri, {
            headers: {
              "content-type": "image/jpeg"
            },
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT
          });
          Alert.alert('', response.body)
          if(response.body.includes("image added")){
            setUpdateFiles(true)
            SetFile(null)
          }
        }
        else {
          //no file selected
          Alert.alert('','Please Select File first');
        }
      };


    const SelectFile = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
      })
      if (!result.cancelled){
      SetFile(result)
      }
    };


    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        {AreFilesUpdated ? (
        <ScrollView >
            {renderButtons()}
        </ScrollView>
        ): null}
        <View style={styles.regform}>
          <TouchableOpacity style={styles.button1} onPress={SelectFile}>
                <Text style={styles.buttontext1}>Pick an image</Text>
            <View>
                {File != null ? (
                    <Text>
                    You have picked
                    </Text>
                ) : null}
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button1} onPress={UploadFileToServer}>
                <Text style={styles.buttontext1}>Upload to server</Text>
          </TouchableOpacity>
        </View>
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
    button1: {
      alignSelf: "stretch",
      alignItems: "center",
      padding: 20,
      backgroundColor: "grey",
      marginTop: 5,
      marginBottom: 5,
  },
  buttontext1:{
      color: "#fff",
      fontWeight: "bold"
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
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
  });