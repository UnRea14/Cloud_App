import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

export default function Login({navigation}){
    const [email='', setEmail] = useState()
    const [password='', setPassword] = useState()
    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Login to your account</Text>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <TextInput style={styles.textinput} placeholder="Password" underlineColorAndroid={"transparent"} secureTextEntry={true} onChangeText={(val) => setPassword(val)}/>
            <TouchableOpacity style={styles.button} onPress={console.log(email + "-" + password)}>
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