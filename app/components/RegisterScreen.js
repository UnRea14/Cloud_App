import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

export default function Register({navigation}){
    const [user_name='', setName] = useState()
    const [user_email='', setEmail] = useState()
    const [user_password='', setPassword] = useState()

    const insertUser = () => {
        fetch("http://192.168.56.1:3000/register", {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({user_name:user_name, user_email:user_email, user_password:user_password})
        })
        .then(resp => resp.json())
        .catch(error => console.log(error))
    }

    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Register a new account</Text>
            <TextInput style={styles.textinput} placeholder="Name" underlineColorAndroid={"transparent"} onChangeText={(val) => setName(val)}/>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <TextInput style={styles.textinput} placeholder="Password" underlineColorAndroid={"transparent"} secureTextEntry={true} onChangeText={(val) => setPassword(val)}/>
            <TouchableOpacity onPress={() => insertUser()} style={styles.button}>
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