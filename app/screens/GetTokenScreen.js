import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import { server_url } from '../components/server_info';


export default function GetTokenScreen({navigation}) {
    const {setIsLoading} = useContext(AuthContext);
    const [code, setCode] = useState('');

    const getToken = async() => {
        if (code != ''){
            setIsLoading(true);
            let response = await fetch(server_url + "/forgotPassword/code", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    code: code
                })
            })
            let json = await response.json();
            setIsLoading(false);
            if (typeof json !== "object")
                Alert.alert('', json);
            else {
                token = json["token"];
                Alert.alert('', "Code is matching", [{text: "Ok", onPress: () => navigation.navigate("ChangePassword", {token: token})}]);
            }
        }
    }

    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Enter the code</Text>
            <TextInput style={styles.textinput} placeholder={"Code"} onChangeText={(val) => setCode(val)}></TextInput>
            <TouchableOpacity style={styles.button} onPress={() => getToken()}>
                <Text style={styles.buttontext}>Check code</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    regform:{
        alignSelf: "stretch",
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
        justifyContent: "center"
    },
    header:{
        fontSize: 24,
        color: "black",
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: "#199187",
        borderBottomWidth: 1,
    },
    textinput:{
        alignSelf: "stretch",
        height: 40,
        marginBottom: 30,
        color: "grey",
        borderBottomColor: "#199187",
        borderBottomWidth: 1,
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
    },
    forgotpassword: {
        color: "#00ffff",
        fontWeight: "bold"
    }
})