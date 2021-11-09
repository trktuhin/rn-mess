import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import MessScreen from "../screens/mess/MessScreen";
import UpdateMessScreen from "../screens/mess/UpdateMessScreen";

const Stack = createStackNavigator();

const MessNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={routes.MESS} component={MessScreen} />
        <Stack.Screen name={routes.UPDATE_MESS} component={UpdateMessScreen} options={{ title: 'Update Mess' }} />
    </Stack.Navigator>
);

export default MessNavigator;