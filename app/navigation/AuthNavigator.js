import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import LoginScreen from "../screens/auth/LoginScreen";
import RegistrationScreen from "../screens/auth/RegistrationScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={routes.LOGIN} component={LoginScreen}
            options={{ title: 'Sign In' }} />
        <Stack.Screen name={routes.REGISTER} component={RegistrationScreen}
            options={{ title: 'Sign Up' }} />
    </Stack.Navigator>
);

export default AuthNavigator