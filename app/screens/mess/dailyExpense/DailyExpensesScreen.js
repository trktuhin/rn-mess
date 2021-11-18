import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import useAuth from '../../../auth/useAuth';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import ActivityIndication from '../../../components/ActivityIndicator';
import routes from '../../../navigation/routes';
import sessionApi from '../../../api/session';
import dailyExpenseApi from '../../../api/dailyExpense';
import AppText from '../../../components/AppText';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import DailyExpenseList from '../../../components/expense/DailyExpenseList';

function DailyExpensesScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [dailyExpenses, setDailyExpenses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(0);
    const { decodedToken } = useAuth();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            decodedToken().then((option) => {
                if (option.messRole == "admin" || option.messRole == "manager") {
                    navigation.setOptions({
                        headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITDAILYEXPENSE, { id: 0 })} />
                    });
                }
            }).catch((err) => console.log(err));
            sessionApi.getSessions().then(res => {
                setSessions(res?.data);
                if (res?.data.length > 0) {
                    setSelectedSessionId(res.data[0].id);
                }
                dailyExpenseApi.getDailyExpenses(selectedSessionId).then(response => {
                    setDailyExpenses(response?.data);
                }).catch((_) => console.log('Could not get daily expenses'))
                    .finally(() => setLoading(false));
            }).catch(err => console.log(err));
        });
        return unsubscribe;
    }, [navigation]);

    const geMealRate = () => {
        let totalExpense = 0;
        let totalMeal = 0;
        dailyExpenses.forEach(element => {
            totalExpense += element.expense;
            totalMeal += element.totalMeal;
        });
        if (totalMeal != 0) {
            return (totalExpense / totalMeal).toFixed(2);
        }
        return 0;
    }


    return (
        <>
            {loading && <ActivityIndication visible={loading} />}
            <View style={styles.container}>
                <View style={styles.topBarContainer}>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedSessionId(value)}
                            placeholder={{
                                label: 'Select Session',
                                value: 0,
                                color: colors.primary,
                            }}
                            items={sessions.map((session) => {
                                return {
                                    label: `${session.title}`,
                                    value: session.id
                                }
                            })
                            }
                            value={selectedSessionId}
                            style={pickerSelectStyles}
                        />
                    </View>
                    <View style={styles.mealRateLabel}>
                        <AppText>Meal Rate: ৳ {geMealRate()}</AppText>
                    </View>
                </View>

                {dailyExpenses.length > 0 && <View>
                    <FlatList
                        data={dailyExpenses}
                        keyExtractor={expense => expense.id.toString()}
                        ItemSeparatorComponent={ListItemSeparator}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <DailyExpenseList
                            day={item.day}
                            totalMeal={item.totalMeal}
                            totalExpense={item.expense}
                            responsibleMember={item.responsibleMember}
                            onPress={() => navigation.navigate(routes.NEWEDITDAILYEXPENSE,
                                {
                                    id: item.id,
                                    day: item.day,
                                    responsibleMember: item.responsibleMember,
                                    totalExpense: item.expense
                                })}
                        />}
                    />
                </View>}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingBottom: 120
    },
    topBarContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    pickerStyle: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 10,
        marginRight: 5
    },
    mealRateLabel: {
        flex: 1,
        padding: 10,
        alignItems: 'flex-end'
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default DailyExpensesScreen;