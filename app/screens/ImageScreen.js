import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, ImageBackground, SafeAreaView, StatusBar, Alert} from 'react-native';
import  {server_url} from '../components/server_info';
import {Appbar, Menu} from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { AuthContext } from '../context/AuthContext';


export default function ImageView({navigation, route}) {
    // טענת כניסה - עצם ניווט, נתיב(בתוך הנתיב הוא מקבל שם תמונה ופונקציה שמשנה את המצב של משתנה מצב)
    // טענת יציאה - מסך תמונה
    const {Filename, setState} = route.params;
    const {userToken, setIsLoading} = useContext(AuthContext);
    const [imageOBJ, SetImageOBJ] = useState({});
    const [openMenu,setOpenMenu] = useState(false);
    const path = FileSystem.documentDirectory + Filename;


    const DeleteImage = () => {
        // טענת כניסה - אין
        // טענת יציאה - מבקש מהשרת למחוק את התמונה עם השם שנמצא במשתנה המצב, במקרה שמוחק עצם הניווט מחזיר את המשתמש למסך התמונות שבענן
        setIsLoading(true);
        fetch(server_url + "/deleteImage/" + Filename, {
        method: "Get",
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
                setIsLoading(false);
                Alert.alert('', json, [{text: "Ok", onPress: () => navigation.goBack()}]), setState(true)
                }
            })
    }


    const DownloadImage = async() => {
        // טענת כניסה - אין
        // טענת יציאה - מבקש רשות לגשת למדיה של הטלפון אם ניתנת אז הוא שומר את התמונה אחרת הוא מעלה התראה שאומרת שצריך גישות עבור האפליקציה הזאת  
        setIsLoading(true);
        let res = await MediaLibrary.requestPermissionsAsync();
        if (res.granted){
            await FileSystem.writeAsStringAsync(path, imageOBJ.base64, {encoding: FileSystem.EncodingType.Base64});
            await MediaLibrary.saveToLibraryAsync(path);
            Alert.alert('', "Image downloaded", [{text: "Ok"}])
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
            Alert.alert('', "This app needs permissions for MEDIA LIBRARY. enable them in yor phone settings", [{text: "Ok"}])
        }
    }

    useEffect(() => {
        // טענת כניסה - אין
        // טענת יציאה - משיג את התמונה מהשרת ומעדכן את משתנה המצב שיכיל אותה
        setIsLoading(true);
        fetch(server_url + "/Image/" + Filename, {
            method: "GET",
            headers: {
                "x-access_token": userToken
            }
        })
          .then((response) => response.json())
            .then((json) => {
                if (json === "Token is invalid"){
                    logout();
                }
                else {
                    setIsLoading(false);
                    SetImageOBJ(json);
                }
            })
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
                        <Menu.Item title="Download to phone" onPress={() => {Alert.alert('', "Are you sure you want to download this image from the cloud?", [{text: "Yes", onPress: () => DownloadImage()}, {text: "No"}])}} />
                        <Menu.Item title="Delete from cloud" onPress={() => {Alert.alert('', "Are you sure you want to delete this image from the cloud?", [{text: "Yes", onPress: () => DeleteImage()}, {text: "No"}])}} />
                        <Menu.Item title="Details" onPress={() => {Alert.alert('Image details', "name: " + imageOBJ.name + "\ndate uploaded: " + imageOBJ.date_uploaded)}} />
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