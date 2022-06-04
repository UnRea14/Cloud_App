import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import  {server_url} from './server_info'


export default function ImageView({navigation, route}) {
    const {user_ID, Filename} = route.params;
    const [imageOBJ, SetImageOBJ] = useState({})
    server_url + "/Image/" + user_ID + "/" + Filename

    useEffect(() => {
        fetch(server_url + "/Image/" + user_ID + "/" + Filename)
          .then((response) => response.json())
            .then((json) => SetImageOBJ(json))
        }, []);
    
    return (
        <View>
            {imageOBJ != {} ? (
                imagebase64 = 'data:image/jpeg;base64,' + imageOBJ.base64,
                <ImageBackground style={styles.image} source={{uri: imagebase64}}>
                </ImageBackground>
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
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
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