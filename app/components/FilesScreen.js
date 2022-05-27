import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FS from 'expo-file-system';
import {StyleSheet, View, Text, TouchableOpacity, Button} from 'react-native';
url = 'https://a20d-2a00-7c40-c690-1d7-c0c2-ea61-d7ea-c5c9.ngrok.io/uploadImage';

export default function Upload() {
    const [File, SetFile] = useState(null)

    const UploadFileToServer = async () => {
        if (File != null) {
          const fileToUpload = File;
          let response = await FS.uploadAsync(url, fileToUpload.uri, {
            headers: {
              "content-type": "image/jpeg",
            },
            httpMethod: "POST",
            uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
          });
          console.log(JSON.stringify(response))
        } else {//no file selected
          alert('Please Select File first');
        }
      };

    const SelectFile = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
      })
      SetFile(result)
    };
  
    return (
      <View style={styles.regform}>
            <TouchableOpacity style={styles.button} onPress={SelectFile}>
                <Text style={styles.buttontext}>Pick an image</Text>
            <View>{/*doesnt work*/}
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