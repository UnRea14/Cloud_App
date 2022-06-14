import React, {useState, useContext} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import PasswordInput from '../components/PasswordInput';
import { AuthContext } from '../context/AuthContext';


export default function Login({navigation}){
    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const validationstring = "password must contain at least 8 charcters and can contain only english letters and numbers"

    return (
        <View style={styles.regform}>
            <Text style={styles.header}>Login to your account</Text>
            <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} onChangeText={(val) => setEmail(val)}/>
            <PasswordInput onChangeText={(val) => setPassword(val)}/>
            {(password.length < 8 || !/^\w+$/.test(password)) ?
            (<Text style={styles.validationtext}>{validationstring}</Text>): <Text style={styles.validationtext}>{''}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => login(email, password)}>
                <Text style={styles.buttontext}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.buttontext}>Forgot password?</Text>
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
    validationtext:{
        color: '#708090',
        fontWeight: 'bold'
    },
    forgotpassword: {
        color: "#00ffff",
        fontWeight: "bold"
    }
})