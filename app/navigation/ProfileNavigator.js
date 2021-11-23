import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const ProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.amber } }}>
        <Stack.Screen name={routes.PROFILE} component={ProfileScreen} />
        <Stack.Screen name={routes.EDITPROFILE} component={EditProfileScreen} options={{ title: "Edit Profile" }} />
        <Stack.Screen name={routes.CHANGE_PASSWORD} component={ChangePasswordScreen} options={{ title: "Change Password" }} />
    </Stack.Navigator>
);

export default ProfileNavigator;