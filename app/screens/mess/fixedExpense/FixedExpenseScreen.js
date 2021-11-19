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

function FixedExpenseScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [totalMember, setTotalMember] = useState(0);
    const { decodedToken } = useAuth();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            decodedToken().then((option) => {
                if (option.messRole == "admin" || option.messRole == "manager") {
                    navigation.setOptions({
                        headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITFIXEDEXPENSE, { id: 0 })} />
                    });
                }
            }).catch((err) => console.log(err));
            sessionApi.getSessions().then(res => {
                setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    setSelectedSessionId(initialSessionId);
                    fixedEpenseApi.getFixedExpenses(initialSessionId).then(response => {
                        setFixedExpenses(response?.data);
                        membersApi.getMembers().then(res => {
                            setTotalMember(res.data?.length ? res.data.length : 0);
                        }).catch((_) => console.log('Could not get total members'));
                    }).catch((_) => console.log('Could not get fixed expenses'))

                }
                else {
                    setSelectedSessionId(0);
                    fixedEpenseApi.getFixedExpenses(0).then(response => {
                        setFixedExpenses(response?.data);
                    }).catch((_) => console.log('Could not get fixed expenses'));
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false));
        });
        return unsubscribe;
    }, [navigation]);

    const fetchFixedExpenses = (sessionId) => {
        setLoading(true);
        fixedEpenseApi.getFixedExpenses(sessionId).then(response => {
            setFixedExpenses(response?.data);
        }).catch((_) => console.log('Could not get daily expenses'))
            .finally(() => setLoading(false));
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
            {(selectedSessionId !== null) &&
                <View style={styles.container}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.pickerStyle}>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    setSelectedSessionId(value);
                                    fetchFixedExpenses(value);
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
                            <AppText>Per Member: ৳ {getPerMemberCost()}</AppText>
                        </View>
                    </View>

                    {fixedExpenses.length > 0 && <View>
                        <FlatList
                            data={fixedExpenses}
                            keyExtractor={expense => expense.id.toString()}
                            ItemSeparatorComponent={ListItemSeparator}
                            showsVerticalScrollIndicator={false}
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
                    {fixedExpenses.length === 0 &&
                        <View style={styles.NoDataContainer}>
                            <AppText>No data found for this session</AppText>
                        </View>}
                </View>}
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
    },
    NoDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 150
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