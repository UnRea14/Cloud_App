import React, {useContext} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';

    export const CustomActivityIndicator = () => { 
        return (
        <View style={styles.loading}>
            <ActivityIndicator size={'large'} color="#0000ff"/>
        </View>
        );
    }

function AppNav() {
    // טענת כניסה - טוקן
    // טענת יציאה - ניווט
    const {isLoading, userToken} = useContext(AuthContext);

    return (
        <NavigationContainer>
            {userToken !== null ? <AppStack/>: <AuthStack/>}
            {isLoading ? <CustomActivityIndicator/>: null}
        </NavigationContainer>
    );
}
export default AppNav;


const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
})
