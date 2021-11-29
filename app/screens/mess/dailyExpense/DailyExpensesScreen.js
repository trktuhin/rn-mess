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
import useIsMounted from '../../../hooks/useIsMounted';

function DailyExpensesScreen({ navigation }) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(true);
    const [isloaded, setIsLoaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dailyExpenses, setDailyExpenses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(-1);
    const { decodedToken } = useAuth();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsLoaded(false);
            decodedToken().then((option) => {
                if (option.messRole == "admin" || option.messRole == "manager") {
                    navigation.setOptions({
                        headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITDAILYEXPENSE, { id: 0 })} />
                    });
                }
            }).catch((err) => console.log(err));
            sessionApi.getSessions().then(res => {
                if (isMounted.current) setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    dailyExpenseApi.getDailyExpenses(initialSessionId).then(response => {
                        if (isMounted.current) setDailyExpenses(response?.data);
                    }).catch((_) => console.log('Could not get daily expenses'))
                        .finally(() => {
                            if (isMounted.current) {
                                setLoading(false);
                                setSelectedSessionId(initialSessionId);
                                setIsLoaded(true);
                            }
                        });
                }
                else {
                    dailyExpenseApi.getDailyExpenses(0).then(response => {
                        if (isMounted.current) setDailyExpenses(response?.data);
                    }).catch((_) => console.log('Could not get daily expenses'))
                        .finally(() => {
                            if (isMounted.current) {
                                setLoading(false);
                                setSelectedSessionId(0);
                                setIsLoaded(true);
                            }
                        });
                }
            }).catch(err => console.log(err));
        });
        return unsubscribe;
    }, [navigation]);

    const fetchDailyExpenses = (sessionId) => {
        if (isMounted.current) setLoading(true);
        dailyExpenseApi.getDailyExpenses(sessionId).then(response => {
            if (isMounted.current) setDailyExpenses(response?.data);
        }).catch((_) => console.log('Could not get daily expenses'))
            .finally(() => { if (isMounted.current) setLoading(false) });
    }

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
            {(selectedSessionId > -1) && <View style={styles.container}>
                <View style={styles.topBarContainer}>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            onValueChange={(value) => {
                                if (isloaded && value !== selectedSessionId) {
                                    setSelectedSessionId(value);
                                    fetchDailyExpenses(value);
                                }
                            }}
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

                {dailyExpenses.length > 0 && <View style={styles.flatListContainer}>
                    <FlatList
                        data={dailyExpenses}
                        keyExtractor={expense => expense.id.toString()}
                        ItemSeparatorComponent={ListItemSeparator}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={() => fetchDailyExpenses(selectedSessionId)}
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
                {(dailyExpenses.length === 0 && !loading) &&
                    <View style={styles.NoDataContainer}>
                        <AppText>No Data Found.</AppText>
                    </View>}
            </View>}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingBottom: 0
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
    },
    NoDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 150
    },
    flatListContainer: {
        flex: 1
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