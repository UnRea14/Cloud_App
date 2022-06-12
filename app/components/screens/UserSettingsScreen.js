import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, useColorScheme} from 'react-native';
import { AuthContext } from '../context/AuthContext';


export default function Home() {
    const {logout} = useContext(AuthContext)
    return(
        <View>
            <TouchableOpacity style={styles.button}onPress={() => logout()}>
                <Text style={styles.buttontext}>Log out</Text>
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
    }
})
