import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import MembersScreen from "../screens/members/MembersScreen";
import MemberDetailsScreen from "../screens/members/MemberDetailsScreen";
import NewEditMemberScreen from "../screens/members/NewEditMemberScreen";
import IconButton from "../components/IconButton";
import colors from "../config/colors";
import ViewMealsScreen from "../screens/members/ViewMealsScreen";

const Stack = createStackNavigator();

const MemberNavigator = () => (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.amber } }}>
        <Stack.Screen name={routes.MEMBERS} component={MembersScreen}
            options={({ navigation }) => ({
                title: 'Members'
            })} />
        <Stack.Screen name={routes.MEMBERDETAILS} component={MemberDetailsScreen}
            options={({ route }) => ({ title: 'Details of ' + route.params.member.firstName })} />

        <Stack.Screen name={routes.VIEWMEALS} component={ViewMealsScreen}
            options={({ route }) => ({ title: 'Meals of ' + route.params.member.firstName })} />

        <Stack.Screen name={routes.NEWEDITMEMBER} component={NewEditMemberScreen}
            options={({ route }) => (
                {
                    title: route.params?.id === 0 ? 'New Member' : 'Edit Member'
                })} />
    </Stack.Navigator>
);

export default MemberNavigator;
