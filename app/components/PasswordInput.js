import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default class PasswordInput extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            secureTextEntry: true,
            iconName: "eye"
        }
    }

    onIconPress = () => {
        let iconName = (this.state.secureTextEntry) ? "eye-off": "eye";
        this.setState({
            secureTextEntry: !this.state.secureTextEntry,
            iconName: iconName
        });
    }

    render () {
        return (
            <View style={{borderBottomWidth: 1, flexDirection: "row"}}>
                <TextInput {...this.props}
                    placeholder="Password"
                    underlineColorAndroid={"transparent"}
                    style={{flex:1}}
                    secureTextEntry={this.state.secureTextEntry}
                />
                <TouchableOpacity onPress={this.onIconPress}>
                    <Ionicons name={this.state.iconName} size={20}/>
                </TouchableOpacity>
            </View>
        );
    }
}