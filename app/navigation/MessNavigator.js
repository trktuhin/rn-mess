import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import routes from './routes';
import MessScreen from "../screens/mess/MessScreen";
import UpdateMessScreen from "../screens/mess/UpdateMessScreen";
import SessionsScreen from "../screens/mess/session/SessionsScreen";
import NewEditSessionScreen from "../screens/mess/session/NewEditSessionScreen";
import DailyExpensesScreen from "../screens/mess/dailyExpense/DailyExpensesScreen";
import NewEditDailyExpenseScreen from "../screens/mess/dailyExpense/NewEditDailyExpenseScreen";
import FixedExpenseScreen from "../screens/mess/fixedExpense/FixedExpenseScreen";
import NewEditFixedExpenseScreen from "../screens/mess/fixedExpense/NewEditFixedExpenseScreen";

const Stack = createStackNavigator();

const MessNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={routes.MESS} component={MessScreen} />
        <Stack.Screen name={routes.UPDATE_MESS} component={UpdateMessScreen} options={{ title: 'Update Mess' }} />
        <Stack.Screen name={routes.SESSIONS} component={SessionsScreen} options={{ title: 'Sessions' }} />
        <Stack.Screen name={routes.DAILYEXPENSES} component={DailyExpensesScreen} options={{ title: 'Daily Expenses' }} />
        <Stack.Screen name={routes.FIXEDEXPENSES} component={FixedExpenseScreen} options={{ title: 'Fixed Expenses' }} />
        <Stack.Screen name={routes.NEWEDITSESSION} component={NewEditSessionScreen} options={({ route }) => ({ title: route.params?.id === 0 ? 'New Session' : 'Edit Session' })} />
        <Stack.Screen name={routes.NEWEDITDAILYEXPENSE} component={NewEditDailyExpenseScreen} options={({ route }) => ({ title: route.params?.id === 0 ? 'New Daily Expense' : 'Edit Daily Expense' })} />
        <Stack.Screen name={routes.NEWEDITFIXEDEXPENSE} component={NewEditFixedExpenseScreen} options={({ route }) => ({ title: route.params?.id === 0 ? 'New Fixed Expense' : 'Edit Fixed Expense' })} />
    </Stack.Navigator>
);

export default MessNavigator;