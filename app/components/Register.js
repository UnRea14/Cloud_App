import React from 'react';
import {StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    } from 'react-native';

export default class Register extends React.Component{
    render() {
        return (
            <View style={styles.regform}>

                <Text style={styles.header}>Register a new account</Text>

                <TextInput style={styles.textinput} placeholder="Name" underlineColorAndroid={"transparent"} />
                <TextInput style={styles.textinput} placeholder="Email" underlineColorAndroid={"transparent"} />
                <TextInput style={styles.textinput} placeholder="Password" underlineColorAndroid={"transparent"} />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttontext}>Register</Text>
                    </TouchableOpacity>

            </View>
        );
    }
}

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