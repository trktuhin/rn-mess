import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import useAuth from '../../../auth/useAuth';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import ActivityIndication from '../../../components/ActivityIndicator';
import routes from '../../../navigation/routes';
import sessionApi from '../../../api/session';
import fixedEpenseApi from '../../../api/fixedExpense';
import membersApi from '../../../api/member';
import AppText from '../../../components/AppText';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import FixedExpenseList from '../../../components/expense/FixedExpenseList';
import useIsMounted from '../../../hooks/useIsMounted';

function FixedExpenseScreen({ navigation }) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [refreshing, setRefresing] = useState(false);
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(-1);
    const [totalMember, setTotalMember] = useState(0);
    const { decodedToken } = useAuth();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsLoaded(false);
            decodedToken().then((option) => {
                if (option.messRole == "admin" || option.messRole == "manager") {
                    navigation.setOptions({
                        headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITFIXEDEXPENSE, { id: 0 })} />
                    });
                }
            }).catch((err) => console.log(err));

            sessionApi.getSessions().then(res => {
                if (isMounted.current) setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    fixedEpenseApi.getFixedExpenses(initialSessionId).then(response => {
                        if (isMounted.current) setFixedExpenses(response?.data);
                        membersApi.getMembers().then(res => {
                            if (isMounted.current) setTotalMember(res.data?.length ? res.data.length : 0);
                        }).catch((_) => console.log('Could not get total members'))
                            .finally(() => {
                                if (isMounted.current) {
                                    setSelectedSessionId(initialSessionId);
                                    setIsLoaded(true);
                                }
                            });
                    }).catch((_) => console.log('Could not get fixed expenses'))

                }
                else {
                    fixedEpenseApi.getFixedExpenses(0).then(response => {
                        if (isMounted.current) setFixedExpenses(response?.data);
                        membersApi.getMembers().then(res => {
                            if (isMounted.current) setTotalMember(res.data?.length ? res.data.length : 0);
                        }).catch((_) => console.log('Could not get total members'))
                            .finally(() => {
                                if (isMounted.current) {
                                    setSelectedSessionId(0);
                                    setIsLoaded(true);
                                }
                            });
                    }).catch((_) => console.log('Could not get fixed expenses'));
                }
            }).catch(err => console.log(err)).finally(() => { if (isMounted.current) setLoading(false) });
        });
        return unsubscribe;
    }, [navigation]);

    const fetchFixedExpenses = (sessionId) => {
        if (isMounted.current) setLoading(true);
        fixedEpenseApi.getFixedExpenses(sessionId).then(response => {
            if (isMounted.current) setFixedExpenses(response?.data);
        }).catch((_) => console.log('Could not get daily expenses'))
            .finally(() => { if (isMounted.current) setLoading(false) });
    }
    const getPerMemberCost = () => {
        let sum = 0;
        fixedExpenses.forEach(element => {
            sum += element.amount;
        });
        return totalMember !== 0 ? (sum / totalMember).toFixed(2) : 0;
    }
    return (
        <>
            {loading && <ActivityIndication visible={loading} />}
            {(selectedSessionId > -1) &&
                <View style={styles.container}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.pickerStyle}>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    if (isLoaded && value !== selectedSessionId) {
                                        setSelectedSessionId(value);
                                        fetchFixedExpenses(value);
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
                            <AppText>Per Member: ??? {getPerMemberCost()}</AppText>
                        </View>
                    </View>

                    {fixedExpenses.length > 0 && <View style={styles.flatListContainer}>
                        <FlatList
                            data={fixedExpenses}
                            keyExtractor={expense => expense.id.toString()}
                            ItemSeparatorComponent={ListItemSeparator}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            onRefresh={() => fetchFixedExpenses(selectedSessionId)}
                            renderItem={({ item }) => <FixedExpenseList
                                expenseDate={item.effectiveDate}
                                title={item.title}
                                totalExpense={item.amount}
                                remarks={item.remarks}
                                onPress={() => navigation.navigate(routes.NEWEDITFIXEDEXPENSE,
                                    {
                                        id: item.id,
                                        fixedExpense: item
                                    })}
                            />}
                        />
                    </View>}
                    {((!loading) && (fixedExpenses.length === 0)) &&
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
        flex: 1,
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

export default FixedExpenseScreen;