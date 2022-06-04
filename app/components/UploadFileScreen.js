import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FS from 'expo-file-system';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import  {server_url} from './server_info'


export default function FilesScreen({navigation, route}) {
    const {user_ID} = route.params;
    const [File, SetFile] = useState(null)

    const UploadFileToServer = async () => {
        if (File != null) {
          const fileToUpload = File;
          let response = await FS.uploadAsync(server_url + '/uploadImage/' + user_ID, fileToUpload.uri, {
            headers: {
              "content-type": "image/jpeg",
            },
            httpMethod: "POST",
            uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
          });
          alert(response.body)
        } else {
          //no file selected
          alert('Please Select File first');
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
      <View style={styles.regform}>
            <TouchableOpacity style={styles.button} onPress={SelectFile}>
                <Text style={styles.buttontext}>Pick an image</Text>
            <View>
                {File != null ? (
                    <Text>
                    You have picked
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