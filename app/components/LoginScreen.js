import React, {useState} from 'react';
import  {server_url} from './server_info'
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import PasswordInput from './PasswordInput';


export default function Login({navigation}){
    const [email='', setEmail] = useState()
    const [password='', setPassword] = useState()
    const loginUser = async() => {
        let response = await fetch(server_url + '/login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_email: email,
              user_password: password
            })
        })
        let res = await response.json()
        splitted_res = res.split(",")
        user_ID = splitted_res[0]
        message = splitted_res[1]
        if (message != null && message.includes("Login successful")) //security problem
            Alert.alert('',message,[{text: "Ok", onPress: navigation.reset({
                index:0,
                routes:[
                    {
                      name:"Main",
                      params: {user_ID: user_ID}
                    },
                ]})}])
        else 
            Alert.alert('',res)
    }

    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Login to your account</Text>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <PasswordInput onChangeText={(val) => setPassword(val)}/>
            <TouchableOpacity style={styles.button} onPress={() => loginUser()}>
                <Text style={styles.buttontext}>Login</Text>
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
    }
})