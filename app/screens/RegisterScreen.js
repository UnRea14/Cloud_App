import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import PasswordInput from '../components/PasswordInput';
import { AuthContext } from '../context/AuthContext';


export default function Register(){
    // טענת כניסה - פונקצית רגיסטר
    // טענת יציאה - מסך רישום
    const {register} = useContext(AuthContext)
    const [name='', setName] = useState()
    const [email='', setEmail] = useState()
    const [password='', setPassword] = useState()
    const validationstring = "password must contain at least 8 charcters and can contain only english letters and numbers"
    const validationstring2 = "name must contain only english charcters and be bigger then 1 and smaller then 20"


    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Register a new account</Text>
            <TextInput style={styles.textinput} placeholder="Name" underlineColorAndroid={"transparent"} onChangeText={(val) => setName(val)}/>
            <View>
            {(name.length < 1 || name.length > 20 || !/^[A-Za-z0-9]*$/.test(name)) ? <Text style={styles.validationtext}>{validationstring2}</Text>: <Text style={styles.validationtext}>{''}</Text>}
                </View>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <PasswordInput onChangeText={(val) => setPassword(val)}/>
            {(password.length < 8 || password.length > 20 || !/^\w+$/.test(password)) ?
            (<Text style={styles.validationtext}>{validationstring}</Text>): <Text style={styles.validationtext}>{''}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => register(name, email, password)}>
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