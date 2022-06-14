import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import  {server_url} from '../components/server_info'
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);


    const register = async(user_name, user_email, user_password) => {
        setIsLoading(true);
        let response = await fetch(server_url + '/register', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: user_name,
              email: user_email,
              password: user_password
            })
        })
        let json = await response.json()
        setIsLoading(false);
        Alert.alert('',json)
    }


    const login = async(user_email, user_password) => {
        setIsLoading(true);
        let response = await fetch(server_url + '/login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: user_email,
              password: user_password
            })
        })
        let res = await response.json()
        if (typeof res !== "object"){
            setIsLoading(false);
            Alert.alert('', res);
        }
        else{
            Alert.alert('', "Login successful");
            Info = jwt_decode(res['token']);
            setUserInfo(Info);
            setUserToken(res['token']);
            AsyncStorage.setItem('userToken', res['token']);
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
        }
    }


    const deleteUser = () => {
        setIsLoading(true);
        fetch(server_url + '/deleteUser', {
            method: 'GET',
            headers: {
                'x-access-token':  userToken
            }
        })
        .then((response) => response.json())
        .then((json) => {
            if(json === "User deleted")
                Alert.alert('', json, [{text: "Ok", onPress: () => {
                    setUserToken(null),
                    AsyncStorage.removeItem('userToken')
                    setIsLoading(false);
                }}])
            else if (json === "Token is invalid"){
                logout();
                }
            else{
                setIsLoading(false);
                Alert.alert('', json);
            }
            })
    }
    

    const logout = () => {
        setIsLoading(true);
        fetch(server_url + "/logout", {
            method: 'GET',
            headers: {
                "x-access-token": userToken
            }
        })
        setUserToken(null);
        setUserInfo(null);
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('userInfo')
        setIsLoading(false);
    }


    const isLoggedIn = async() => {
        try{
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo')
            if (userToken !== null){
                fetch(server_url + "/tokenValid", {
                    method: 'GET',
                    headers: {
                        "x-access-token": userToken
                    }
                })
                .then((response) => response.json())
                .then((json) => {
                    if (json !== "Login successful" ){
                        logout();
                        return;
                    }
                })
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            setIsLoading(false);
        }
        catch(e){
            console.log("error" + e);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, [])

    return (
        <AuthContext.Provider value={{register, login, logout, deleteUser, setIsLoading, setUserToken, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    );
}