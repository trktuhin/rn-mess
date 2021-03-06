import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import AppText from '../../../components/AppText';
import colors from '../../../config/colors';
import sessionApi from '../../../api/session';
import depositApi from '../../../api/deposit';
import ActivityIndication from '../../../components/ActivityIndicator';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import DepositHistoryList from '../../../components/deposit/DepositHistoryList';
import useIsMounted from '../../../hooks/useIsMounted';

function DepositHistoryScreen({ route, navigation }) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [depositHistory, setDepositHistory] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(-1);
    const membeerId = route.params?.id ? route.params.id : 0;
    const memberName = route.params?.name ? route.params.name : '';

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isMounted.current) setLoading(true);
            sessionApi.getSessions().then(res => {
                if (isMounted.current) setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    depositApi.getDepositHistory(membeerId, initialSessionId).then(response => {
                        if (response.ok) {
                            if (isMounted.current) setDepositHistory(response?.data);
                        }
                    }).catch((_) => console.log('Could not get deposit history'))
                        .finally(() => {
                            if (isMounted.current) {
                                setSelectedSessionId(initialSessionId);
                                setLoading(false);
                            }
                        });

                }
                else {
                    depositApi.getDepositHistory(membeerId, 0).then(response => {
                        if (response.ok) {
                            if (isMounted.current) setDepositHistory(response?.data);
                        }
                    }).catch((_) => console.log('Could not get deposits'))
                        .finally(() => {
                            if (isMounted.current) {
                                setSelectedSessionId(0);
                                setLoading(false);
                            }
                        });
                }
            }).catch(err => console.log(err));
        });
        return unsubscribe;
    }, [navigation]);

    const fetchDepositHistory = (sessionId) => {
        setLoading(true);
        depositApi.getDepositHistory(membeerId, sessionId).then(response => {
            if (response.ok) {
                setDepositHistory(response.data);
            } else {
                alert(response?.data ? response.data : 'Could not fetch deposit history.');
            }
        }).catch((_) => console.log('Could not get deposit history.'))
            .finally(() => setLoading(false));
    }

    const getTotalAdd = () => {
        let debit = 0;
        depositHistory.forEach(element => {
            debit += element.debit;
        });
        return debit;
    }

    const getTotalWithdraw = () => {
        let credit = 0;
        depositHistory.forEach(element => {
            credit += element.credit;
        });
        return credit;
    }

    const getTotalBalance = () => {
        return getTotalAdd() - getTotalWithdraw();
    }


    return (
        <>
            {loading && <ActivityIndication visible={loading} />}
            {(sessions.length > 0 && selectedSessionId > -1) &&
                <View style={styles.container}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.pickerStyle}>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    setSelectedSessionId(value);
                                    fetchDepositHistory(value);
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
                            <AppText>{memberName}</AppText>
                        </View>
                    </View>
                    {depositHistory.length > 0 &&
                        <View style={styles.flatListContainer}>
                            <FlatList
                                data={depositHistory}
                                keyExtractor={history => history.id.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <DepositHistoryList
                                    effectiveDate={item.effectiveDate}
                                    debit={item.debit}
                                    credit={item.credit}
                                    remarks={item.remarks}
                                />}
                            />
                        </View>
                    }
                    {(depositHistory.length == 0) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AppText>No History Found.</AppText>
                    </View>}
                    <View style={styles.footer}>
                        <View style={styles.footerDetails}>
                            <AppText style={styles.footerText}>Add: ??? {getTotalAdd().toFixed(2)}</AppText>
                            <AppText style={styles.footerText}>Withdraw: ??? {getTotalWithdraw().toFixed(2)}</AppText>
                            <AppText style={styles.footerText}>Balance: ??? {getTotalBalance().toFixed(2)}</AppText>
                        </View>
                    </View>
                </View>}
            {(sessions.length == 0 && !loading) &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText>Create a Session. Only Admin can do this.</AppText>
                </View>}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBarContainer: {
        flexDirection: 'row',
        padding: 15,
        paddingBottom: 10,
    },
    flatListContainer: {
        flex: 1,
        paddingHorizontal: 15
    },
    footer: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary
    },
    footerDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    footerText: {
        color: colors.white,
        fontSize: 16
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

export default DepositHistoryScreen;