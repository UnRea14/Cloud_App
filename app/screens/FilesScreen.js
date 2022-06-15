import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView, StatusBar, View, Alert} from 'react-native';
import  {server_url} from '../components/server_info'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AuthContext } from '../context/AuthContext';


export default function FilesScreen({navigation}) {
    // טענת כניסה - עצם ניווט
    // טענת יציאה - מסך תמונות שבענן
    const {user_ID, userToken, logout, setIsLoading} = useContext(AuthContext);
    const [Files, SetFiles] = useState([]);
    const [updateFiles, setUpdateFiles] = useState(false); //should the files update?
    const [AreFilesUpdated, setAreFilesUpdated] = useState(false);
    const [File, SetFile] = useState(null);


    const UploadFileToServer = async () => {
      // טענת כניסה -אין
      // טענת יציאה - מעלה את התמונה לשרת 
      if (File != null) {
        const fileToUpload = File;
        setIsLoading(true);
        const response = await FileSystem.uploadAsync(server_url + '/uploadImage', fileToUpload.uri, {
          headers: {
            "content-type": "image/jpeg",
            "x-access-token": userToken
          },
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT
        });
        setIsLoading(false);
        Alert.alert('', response.body);
        if(response.body.includes("image added")){
          setUpdateFiles(true);
          SetFile(null);
        }
        else if (response.body.includes("Token is invalid")){
          logout();
        }
      }
      else {
        //no file selected
        Alert.alert('','Please Select File first');
      }
    };


  const SelectFile = async () => {
    // טענת כניסה - אין
    // טענת יציאה - מעלה את ממשק המערכת בשביל לבחור תמונה
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    })
    if (!result.cancelled){
      SetFile(result);
    }
  };


    useEffect(() => {
      // טענת כניסה - אין
      // טענת יציאה - מקבל את רשימת השמות של התמונות שבענן מהשרת
      setIsLoading(true);
      fetch(server_url + '/files', {
        method: 'GET',
        headers: {
          "x-access-token": userToken
        }
      })
        .then((response) => response.json())
          .then((json) => {
            if (json === "Token is invalid"){
              logout();
            }
            else {
              SetFiles(json);
              setUpdateFiles(false);
              setAreFilesUpdated(true);
              setIsLoading(false);
            }
          });
    }, [updateFiles]); //only fetches when updateFiles is true


    const renderButtons = () => {
      const views = [];
        for ( var i = 0; i < Files.length; i++){
          const filename = Files[i]
          views.push(
            <TouchableOpacity style={styles.button} key={i} onPress={() => {navigation.navigate('Image', {user_ID: user_ID, Filename: filename, setState: setUpdateFiles})}} >
            <ImageBackground source={require('../components/placeholder.jpg')} style={styles.image}>
              <Text style={styles.buttontext}> {filename} </Text>
            </ImageBackground>
          </TouchableOpacity>
          );
        }
      return views;
      }


    return (
      <SafeAreaView style={styles.AndroidSafeArea}>
        {Files.length === 0 ? (<View style={styles.regform}>
          <Text style={styles.text}>Nothing to show</Text>
          </View>): null}
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
    text: {
      paddingTop: 40,
      color: "#a9a9a9",
      fontWeight: "bold"
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
      alignItems: "center",
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
  });