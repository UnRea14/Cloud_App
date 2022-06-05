import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ImageBackground, SafeAreaView, StatusBar} from 'react-native';
import  {server_url} from './server_info'
import {Appbar,Menu, Provider} from 'react-native-paper'


export default function ImageView({navigation, route}) {
    const {user_ID, Filename} = route.params;
    const [imageOBJ, SetImageOBJ] = useState({})
    const [openMenu,setOpenMenu] = useState(false)

    const DownloadImage = () => {

    }

    useEffect(() => {
        fetch(server_url + "/Image/" + user_ID + "/" + Filename)
          .then((response) => response.json())
            .then((json) => SetImageOBJ(json))
        }, []);
    
        return (
            <SafeAreaView style={styles.AndroidSafeArea}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title={Filename} />
                    <Menu
                        visible={openMenu}
                        onDismiss={()=>{
                            setOpenMenu(false)
                        }}
                        anchor={
                            <Appbar.Action icon="dots-vertical" color="white" onPress={() => setOpenMenu(true)} />
                        }>
                        <Menu.Item onPress={() => {DownloadImage()}} title="Download to phone" />
                        <Menu.Item onPress={() => {console.log('Option 2 was pressed')}} title="Details" />
                    </Menu>
                </Appbar.Header>
                {imageOBJ.base64 != undefined ? (
                    <ImageBackground style={styles.image} source={{uri: 'data:image/jpeg;base64,' + imageOBJ.base64}}>
                    </ImageBackground>
                ): null}
        </SafeAreaView>
        )
}
const styles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
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