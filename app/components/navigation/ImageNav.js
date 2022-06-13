import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImageScreen from '../screens/ImageScreen';
import FilesScreen from '../screens/FilesScreen';


const Stack = createNativeStackNavigator();

const ImageNav = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Files" component={FilesScreen} options={{headerShown: false}} />
            <Stack.Screen name="Image" component={ImageScreen}  options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

export default ImageNav;