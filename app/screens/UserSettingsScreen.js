import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import { AuthContext } from '../context/AuthContext';


export default function Settings() {
    // טענת כניסה - פונקצית לוגאוט ופונקצית דליט יוקר
    // טענת יציאה - מסך הגדרות המשתמש 
    const {logout, deleteUser} = useContext(AuthContext)

    return(
        <View style={styles.regform}>
            <TouchableOpacity style={styles.button} onPress={() => logout()}>
                <Text style={styles.buttontext}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('', "Are you sure you want to delete this user?", [{text: "Yes", onPress: () => deleteUser()}, {text: "No"}])}>
                <Text style={styles.buttontext}>Delete user</Text>
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
