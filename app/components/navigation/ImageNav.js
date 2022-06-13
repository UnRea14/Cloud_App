
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ImageScreen from '../screens/ImageScreen';
import FilesScreen from '../screens/FilesScreen';
import SettingsScreen from '../screens/UserSettingsScreen';


const Tab = createMaterialBottomTabNavigator();

const ImageNav = () => {

    return (
        <Tab.Navigator >
            <Tab.Screen name="Files" component={FilesScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default ImageNav;