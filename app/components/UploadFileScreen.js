import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
//import { StackActions } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';

export default function Upload(){
    const [singleFile, setSingleFile] = useState(null);


    const uploadImage = async () => {
        if (singleFile != null) {
        //If file selected then create FormData
        const fileToUpload = singleFile;
        const data = new FormData();
        data.append('name', 'Image Upload');
        data.append('file_attachment', fileToUpload);
        let res = await fetch(
            'https://4481-77-137-180-250.ngrok.io/uploadImage',
            {
            method: 'post',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data; '},
            }
        );
        let responseJson = await res.json();
        if (responseJson.status == 1) {
            alert('Upload Successful');
        }
        } else {
        //if no file selected the show alert
        alert('Please Select File first');
        }
    }
  

    const selectFile = async () => {
      // Opening Document Picker to select one file
      try {
        const res = await DocumentPicker.pick({
          // Provide which type of file you want user to pick
          type: [DocumentPicker.types.allFiles],
          // There can me more options as well
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        // Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        // Setting the state to show single file attributes
        setSingleFile(res);
      } catch (err) {
        setSingleFile(null);
        // Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          // If user canceled the document selection
          alert('Canceled');
        } else {
          // For Unknown Error
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    };

    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Upload a file</Text>
            {/*Showing the data of selected Single file*/}
            {singleFile != null ? (
                <Text style={styles.textStyle}>
                File Name: {singleFile.name ? singleFile.name : ''}
                {'\n'}
                Type: {singleFile.type ? singleFile.type : ''}
                {'\n'}
                File Size: {singleFile.size ? singleFile.size : ''}
                {'\n'}
                URI: {singleFile.uri ? singleFile.uri : ''}
                {'\n'}
                </Text>
            ) : null}
            <TouchableOpacity
                style={styles.button}
                onPress={selectFile}>
                <Text style={styles.buttontext}>Select File</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={uploadImage}>
                <Text style={styles.buttontext}>Upload File</Text>
            </TouchableOpacity>
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    regform:{
        alignSelf: "stretch",
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
    header:{
        alignSelf: "center",
        fontSize: 24,
        color: "black",
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: "#199187",
        borderBottomWidth: 1,
    },
    buttontext:{
        color: "#fff",
        fontWeight: "bold"
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