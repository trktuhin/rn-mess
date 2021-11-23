import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Platform, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import colors from '../../config/colors';
import AppText from '../../components/AppText';
import sessionApi from '../../api/session';
import depositApi from '../../api/deposit';
import membersApi from '../../api/member';
import expenseApi from '../../api/fixedExpense';
import ActivityIndication from '../../components/ActivityIndicator';
import ListItemSeparator from '../../components/list/ListItemSeparator';
import TabButton from '../../components/TabButton';
import MemberSummaryList from '../../components/dashboard/MemberSummaryList';
import MemberMealList from '../../components/dashboard/MemberMealList';

function Dashboard({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [summaryTab, setSummaryTab] = useState(true);
    const [membersForMeals, setMembersForMeals] = useState([]);
    const [membersSummary, setMembersSummary] = useState([]);
    const [mealRate, setMealRate] = useState(null);
    const [otherExpense, setOtherExpense] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true);
            sessionApi.getSessions().then(res => {
                setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    setSelectedSessionId(initialSessionId);
                    fetchUpdatedData(initialSessionId).then(() => {
                        //console.log('test result:');
                    }).catch(err => console.log(err));
                }
                else {
                    setSelectedSessionId(0);
                    fetchUpdatedData(0).then(() => { }).catch(err => console.log(err))
                        .finally(() => setLoading(false));
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false));
        });
        return unsubscribe;
    }, [navigation]);

    const getMembersWithDeposits = async (sessionId) => {
        const res = await depositApi.getDeposits(sessionId);
        if (!res.ok) {
            return alert(res.data ? res.data : 'Could not get data.');
        }
        setMembersSummary(res.data);
    }

    const getMembersForMeals = async () => {
        const res = await membersApi.getMembers();
        if (!res.ok) {
            return alert(res.data ? res.data : 'Could not get data.');
        }
        setMembersForMeals(res.data);
    }

    const getOtherMealRate = async (sessionId) => {
        console.log("session Id", sessionId);
        const res = await expenseApi.getOtherMealRate(sessionId);
        if (!res.ok) {
            return alert(res.data ? res.data : 'Could not get data.');
        }
        setMealRate(res.data.mealRate);
        setOtherExpense(res.data.otherExpense);
    }

    const fetchUpdatedData = async (sessionId) => {
        setLoading(true);
        await getMembersWithDeposits(sessionId);
        await getMembersForMeals();
        await getOtherMealRate(sessionId);
        setLoading(false);
    }

    const totalBfCount = () => {
        let bf = 0;
        membersForMeals.forEach(element => {
            bf = bf + element.dBreakfast;
        });
        return bf;
    }
    const totalLchCount = () => {
        let lch = 0;
        membersForMeals.forEach(element => {
            lch = lch + element.dLunch;
        });
        return lch;
    }

    const totalDnrCount = () => {
        let dnr = 0;
        membersForMeals.forEach(element => {
            dnr = dnr + element.dDinner;
        });
        return dnr;
    }

    const getTotalBalance = () => {
        let totalDebit = 0;
        let totalCredit = 0;
        let totalMeals = 0;
        const totalMember = membersForMeals.length;
        membersSummary.forEach(element => {
            totalDebit += element.totalDebit;
            totalCredit += element.totalCredit;
            totalMeals += element.totalMeals;
        });
        return (totalDebit - totalCredit) - (totalMeals * mealRate + (totalMember * otherExpense));
    }

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
            </View>
            <>
                {loading && <ActivityIndication visible={loading} />}
                <View style={styles.container}>
                    <View style={styles.tabContainer}>
                        <View style={styles.tabButtonContainer}>
                            <TabButton onPress={() => setSummaryTab(true)} isActive={summaryTab} title="Summary" />
                        </View>
                        <View style={styles.tabButtonContainer}>
                            <TabButton onPress={() => setSummaryTab(false)} isActive={!summaryTab} title="Meals For Today" />
                        </View>
                    </View>
                    {summaryTab && <>
                        <View style={styles.topBarContainer}>
                            <View style={styles.pickerStyle}>
                                <RNPickerSelect
                                    onValueChange={(value) => {
                                        setSelectedSessionId(value);
                                        fetchUpdatedData(value);
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
                            <View style={styles.secondaryLabel}>
                                <AppText>Balance: ৳ {getTotalBalance().toFixed(2)}</AppText>
                            </View>
                        </View>
                        {(membersSummary.length > 0 && mealRate !== null && otherExpense !== null) &&
                            <View style={styles.flatListContainer}>
                                <FlatList
                                    data={membersSummary}
                                    keyExtractor={ms => ms.memberId.toString()}
                                    ItemSeparatorComponent={ListItemSeparator}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <MemberSummaryList
                                        memberSummary={item}
                                        otherExpense={otherExpense}
                                        mealRate={mealRate}
                                    />}
                                />
                            </View>
                        }
                    </>}
                    {(!summaryTab && membersForMeals.length > 0) &&
                        <>
                            <View style={{ alignItems: 'center', marginBottom: 5 }}>
                                <AppText style={styles.primaryText}>Breakfast: {totalBfCount()}  Lunch: {totalLchCount()}  Dinner: {totalDnrCount()}</AppText>
                            </View>
                            <View style={styles.flatListContainer}>
                                <FlatList
                                    data={membersForMeals}
                                    keyExtractor={memberMeal => memberMeal.id.toString()}
                                    ItemSeparatorComponent={ListItemSeparator}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => <MemberMealList
                                        member={item}
                                    />}
                                />
                            </View>
                        </>}
                </View>
            </>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        minHeight: 90,
        backgroundColor: colors.white,
        elevation: 5,
        alignItems: 'flex-end',
        padding: 15,
        shadowColor: colors.mediumGray,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: .7,
        shadowRadius: 10,
        backgroundColor: colors.amber
    },
    headerTitle: {
        fontWeight: '700',
        fontSize: 20,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : 'Avenir'
    },
    container: {
        flex: 1,
        padding: 15,
        paddingBottom: 0
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tabButtonContainer: {
        flex: 1,
        marginBottom: 5
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
    secondaryLabel: {
        flex: 1,
        padding: 10,
        alignItems: 'flex-end'
    },
    primaryText: {
        color: colors.amber,
        fontWeight: 'bold'
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

export default Dashboard;