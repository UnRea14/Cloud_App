import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

function Register(){
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    return (
        <View style={styles.regform}>

            <Text style={styles.header}>Register a new account</Text>

            <TextInput style={styles.textinput} placeholder="Name" underlineColorAndroid={"transparent"} onChangeText={(val) => setName(val)}/>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <TextInput style={styles.textinput} placeholder="Password" underlineColorAndroid={"transparent"} onChangeText={(val) => setPassword(val)}/>

            <TouchableOpacity style={styles.button}>
                <Text onPress={console.log(name + "-" + email + "-" + password)} style={styles.buttontext}>Register</Text>
            </TouchableOpacity>

        </View>
    );
}

export default Register

const styles = StyleSheet.create({
    regform:{
        alignSelf: "stretch",
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