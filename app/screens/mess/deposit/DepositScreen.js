import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import useAuth from '../../../auth/useAuth';
import colors from '../../../config/colors';
import ActivityIndication from '../../../components/ActivityIndicator';
import sessionApi from '../../../api/session';
import depositApi from '../../../api/deposit';
import AppText from '../../../components/AppText';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import DepositList from '../../../components/deposit/DepositList';

function DepositScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [depositOverviews, setDepositOverviews] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const { decodedToken } = useAuth();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true);
            decodedToken().then((option) => {
                if (option.messRole == "admin" || option.messRole == "manager") {
                    setIsManager(true);
                }
            }).catch((err) => console.log(err));
            sessionApi.getSessions().then(res => {
                setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    setSelectedSessionId(initialSessionId);
                    depositApi.getDeposits(initialSessionId).then(response => {
                        if (response.ok) {
                            setDepositOverviews(response?.data);
                        }
                    }).catch((_) => console.log('Could not get deposits'))

                }
                else {
                    setSelectedSessionId(0);
                    depositApi.getDeposits(0).then(response => {
                        if (response.ok) {
                            setDepositOverviews(response?.data);
                        }
                    }).catch((_) => console.log('Could not get deposits'));
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false));
        });
        return unsubscribe;
    }, [navigation]);

    const fetchDeposits = (sessionId) => {
        setLoading(true);
        depositApi.getDeposits(sessionId).then(response => {
            if (response.ok) {
                setDepositOverviews(response.data);
            } else {
                alert(response?.data ? response.data : 'Could not fetch deposits.');
            }
        }).catch((_) => console.log('Could not get deposits.'))
            .finally(() => setLoading(false));
    }

    const getTotalBalance = () => {
        let totalcredit = 0;
        let totalDebit = 0;
        depositOverviews.forEach(element => {
            totalDebit += element.totalDebit;
            totalcredit += element.totalCredit;
        });
        return totalDebit - totalcredit;
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
                                    fetchDeposits(value);
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
                            <AppText>Total: ৳ {getTotalBalance().toFixed(2)}</AppText>
                        </View>
                    </View>
                    {depositOverviews.length > 0 &&
                        <View style={styles.flatListContainer}>
                            <FlatList
                                data={depositOverviews}
                                keyExtractor={deposit => deposit.memberId.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <DepositList
                                    memberId={item.memberId}
                                    firstName={item.firstName}
                                    lastName={item.lastName}
                                    isManager={isManager}
                                    totalCredit={item.totalCredit}
                                    totalDebit={item.totalDebit}
                                    photoName={item.photoName}
                                />}
                            />
                        </View>
                    }
                </View>
            }
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
    secondaryLabel: {
        flex: 1,
        padding: 10,
        alignItems: 'flex-end'
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
export default DepositScreen;