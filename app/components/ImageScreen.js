import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import  {server_url} from './server_info'


export default function ImageView({navigation, route}) {
    const {user_ID, Filename} = route.params;
    console.log(Filename)
    const [imageOBJ, SetImageOBJ] = useState({})

    console.log("here1")
    useEffect(() => {
    fetch(server_url + "/Image/" + user_ID + "/" + Filename).then((response) => {
        response.json().then((data) => {
            SetImageOBJ(data)
        });
    });
    })
    
    return (
        <View>
            {imageOBJ != null ? (
                imagebase64 = 'data:image/jpeg;base64,' + imageOBJ.bytes,
                <Image style={{width: 100, height: 50, resizeMode: 'stretch', borderWidth: 1, borderColor: 'red'}} source={{uri: imagebase64}}>
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