import React, {useState} from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {StyleSheet, View, Text, TouchableOpacity, Button} from 'react-native';


export default function Upload() {
    const [File, SetFile] = useState(null)

    const UploadFileToServer = async () => {
        if (File != null) {
          const fileToUpload = File;
          const data = new FormData();
          data.append('name', 'Image Upload');
          data.append('file_attachment', fileToUpload);
          let res = await fetch('https://14fb-77-137-180-250.ngrok.io/uploadImage',{
              method: 'POST',
              body: data,
              headers: {
                'Content-Type': 'multipart/form-data; ',
              },
            }
          );
          let responseJson = await res.json();
          if (responseJson.status == 1) {
            alert('Upload Successful');
          }
        } else {//no file selected
          alert('Please Select File first');
        }
      };

    const SelectFile = async () => {
      let result = await DocumentPicker.getDocumentAsync({});
      SetFile(result)
    };
  
    return (
      <View style={styles.regform}>
            <TouchableOpacity style={styles.button} onPress={SelectFile}>
                <Text style={styles.buttontext}>Pick an image</Text>
            <View>
                {File != null ? (
                    <Text>
                    Picked: {File.name ? File.name : ''}
                    </Text>
                ) : null}
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={UploadFileToServer}>
                <Text style={styles.buttontext}>Upload to server</Text>
            </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
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