import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import MessScreen from "../screens/mess/MessScreen";

const Stack = createStackNavigator();

const MessNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={routes.MESS} component={MessScreen} />
    </Stack.Navigator>
);

export default MessNavigator;