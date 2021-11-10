import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import LoginScreen from "../screens/auth/LoginScreen";
import RegistrationScreen from "../screens/auth/RegistrationScreen";
import OtpScreen from "../screens/auth/OtpScreen";
import SuccessfulScreen from "../screens/auth/SuccessfulScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={routes.LOGIN} component={LoginScreen}
            options={{ title: 'Sign In' }} />
        <Stack.Screen name={routes.REGISTER} component={RegistrationScreen}
            options={{ title: 'Sign Up' }} />
        <Stack.Screen name={routes.OTP} component={OtpScreen}
            options={{ title: 'OTP submission' }} />
        <Stack.Screen name={routes.SUCCESSFUL} component={SuccessfulScreen}
            options={{ headerShown: false }} />
    </Stack.Navigator>
);

export default AuthNavigator