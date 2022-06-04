import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import  {server_url} from './server_info'


export default function ImageView({navigation, route}) {
    const [user_ID] = route.params.user_ID;
    const [Filename] = route.params.Filename;
    const [image, SetImage] = useState({})

    useEffect(() => {
        fetch(server_url + "/" + user_ID + "/" + Filename)
          .then((res) => res.json())
            .then((json) => SetImage(json.body))
      })
    
    return (
        <View>
            {image != null ? (
                imagebase64 = 'data:image/jpeg;base64,' + image.bytes,
                <Image style={{width: 100, height: 50, resizeMode: Image.resizeMode.contain, borderWidth: 1, borderColor: 'red'}} source={{uri: imagebase64}}>
                </Image>
            ): null}
        </View>
    )
}
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