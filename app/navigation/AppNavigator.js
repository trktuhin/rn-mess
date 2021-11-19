import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import routes from "./routes";
import Dashboard from '../screens/home/Dashboard';
import colors from "../config/colors";
import MemberNavigator from "./MemberNavigator";
import ProfileNavigator from "./ProfileNavigator";
import MessNavigator from "./MessNavigator";

const Tab = createBottomTabNavigator();

function getIsTabBarShown(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? routes.DASHBOARD;

    switch (routeName) {
        default:
            return true;
    }
}

const AppNavigator = () => (
    <Tab.Navigator
        tabBarOptions={{
            activeTintColor: colors.white,
            activeBackgroundColor: colors.primary,
            labelStyle: {
                paddingBottom: 10,
            }
        }}>
        <Tab.Screen name={routes.DASHBOARD}
            component={Dashboard}
            options={{
                tabBarIcon: ({ color, size }) =>
                    <MaterialCommunityIcons name="home" color={color} size={size} />
            }} />

        <Tab.Screen name="MemberTab"
            component={MemberNavigator}
            options={({ route }) => ({
                title: 'Members',
                tabBarVisible: getIsTabBarShown(route),
                tabBarIcon: ({ color, size }) =>
                    <MaterialCommunityIcons name="account-group" color={color} size={size} />
            })} />

        <Tab.Screen name={routes.MESS}
            component={MessNavigator}
            options={{
                title: 'Mess',
                tabBarIcon: ({ color, size }) =>
                    <MaterialCommunityIcons name="city" color={color} size={size} />
            }} />

        <Tab.Screen
            name="ProfileTab"
            component={ProfileNavigator}
            options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) =>
                    <MaterialCommunityIcons name="account" color={color} size={size} />
            }}
        />
    </Tab.Navigator>
);

export default AppNavigator;