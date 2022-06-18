import React, {useState, useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import PasswordInput from '../components/PasswordInput';
import { server_url } from '../components/server_info';
import { StackActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';


export default function ChangePasswordScreen({navigation, route}){
    // טענת כניסה - טוקן, נתיב, עצם ניווט
    // טענת יציאה - מסך שינוי סיסמה
    const {token} = route.params;
    const {setIsLoading} = useContext(AuthContext);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const comparestring = "Passwords dont match"
    const validationstring = "password must contain at least 8 charcters and can contain only english letters and numbers"


    const isPasswordValid = (password) => {
        // טענת כניסה - סיסמה
        // טענת יציאה - אמת אם הסיסמה תקינה שקר אחרת
        if (password.length < 8 || password.length > 20 || !/^\w+$/.test(password))
            return false;
        return true;
    }


    const changePassword = async() => {
        // טענת כניסה - אין
        // טענת יציאה - אם סיסמה1 לא שווה לסיסמה2 מעלה התראה שהסיסמאות לא שוות, אחרת אם אחד או שני הסיסמאות לא תקינות מעלה התראה שהסיסמאות לא תקינות, אחרת אם סיסמה1 שווה לסיסמה2 הוא שולח לשרת בקשה תלשנות את הסיסמה אם הצליח עצם הניווט מנווט למסך הבית
        if (password1 !== password2){
            Alert.alert('', "Passwords don't match");
        }
        else if (!isPasswordValid(password1) || !isPasswordValid(password2)){
            Alert.alert('', "Passwords are not valid");
        }
        else {
            setIsLoading(true);
            let response = await fetch(server_url + "/changePassword", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({password: password1})
            })
            let json = await response.json();
            setIsLoading(false);
            if (json === "Password changed successfully"){
                Alert.alert('', json, [{text: "Ok", onPress: () => navigation.dispatch(StackActions.popToTop())}]);
            }
            Alert.alert('', json);
        }
    }

    return (
        <View style={styles.regform}>
            <Text>New password</Text>
            <PasswordInput style={styles.textinput} onChangeText={(val1) => setPassword1(val1)}></PasswordInput>
            <Text>Confirm password</Text>
            <PasswordInput style={styles.textinput} onChangeText={(val2) => setPassword2(val2)}></PasswordInput>
            {password1 !== password2 ?
                (<Text style={styles.validationtext}>{comparestring}</Text>): <Text>{''}</Text>}
            {(!isPasswordValid(password1) || !isPasswordValid(password2)) ?
                (<Text style={styles.validationtext}>{validationstring}</Text>): <Text>{''}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => changePassword()}>
                <Text style={styles.buttontext}>ChangePassword</Text>
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
    forgotpassword: {
        color: "#00ffff",
        fontWeight: "bold"
    },
    validationtext:{
        color: '#708090',
        fontWeight: 'bold'
    }
})