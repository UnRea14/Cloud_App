import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import  {server_url} from '../server_info';
import PasswordInput from '../PasswordInput';


export default function Register({navigation}){
    const [name='', setName] = useState()
    const [email='', setEmail] = useState()
    const [password='', setPassword] = useState()
    const validationstring = "password must contain at least 8 charcters and can contain only english letters and numbers"


    const insertUser = async () => {
        let response = await fetch(server_url + '/register', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_name: name,
              user_email: email,
              user_password: password
            })
        })
        let json = await response.json()
        if (json === "User registered! verify your email by the email sent to you in your email")
            Alert.alert('',json,[{text: "Ok", onPress: navigation.reset({
                index:0,
                routes:[
                  {
                    name:"Login",
                  },
                ]})}])
        else 
            Alert.alert('',json)
    }

    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Register a new account</Text>
            <TextInput style={styles.textinput} placeholder="Name" underlineColorAndroid={"transparent"} onChangeText={(val) => setName(val)}/>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <PasswordInput onChangeText={(val) => setPassword(val)}/>
            {(password.length < 8 || !/^\w+$/.test(password)) ?
            (<Text style={styles.validationtext}>{validationstring}</Text>): <Text style={styles.validationtext}>{''}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => insertUser()}>
                <Text style={styles.buttontext}>Register</Text>
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
        fontSize: 22,
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
    validationtext:{
        color: '#708090',
        fontWeight: 'bold'
    }
})