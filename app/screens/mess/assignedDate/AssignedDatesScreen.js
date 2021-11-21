import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import dateFormat from "dateformat";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import useAuth from '../../../auth/useAuth';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import sessionApi from '../../../api/session';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import ActivityIndication from '../../../components/ActivityIndicator';
import routes from '../../../navigation/routes';
import assignedDateApi from '../../../api/assignedDate';
import AppText from '../../../components/AppText';

function AssignedDatesScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [assingedDates, setAssingedDates] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const { decodedToken } = useAuth();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            decodedToken().then((option) => {
                if (option.messRole == "admin" || option.messRole == "manager") {
                    setIsManager(true);
                    navigation.setOptions({
                        headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.ADDASSIGNEDDATE)} />
                    });
                }
            }).catch((err) => console.log(err));

            sessionApi.getSessions().then(res => {
                if (!res.ok) {
                    return alert(res?.data ? res.data : 'Failed to load data');
                }
                setSessions(res.data);

                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    setSelectedSessionId(initialSessionId);
                    assignedDateApi.getAssignedDates(initialSessionId).then(response => {
                        if (response.ok) {
                            setAssingedDates(response?.data);
                        }
                    }).catch((_) => console.log('Could not get assigned dates'));

                }
                else {
                    setSelectedSessionId(0);
                    assignedDateApi.getAssignedDates(0).then(response => {
                        if (response.ok) {
                            setAssingedDates(response?.data);
                        }
                    }).catch((_) => console.log('Could not get assigned dates'));
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false));
        });
        return unsubscribe;
    }, [navigation]);

    const fetchAssignedDates = (sessionId) => {
        setLoading(true);
        assignedDateApi.getAssignedDates(sessionId).then(response => {
            if (response.ok) {
                setAssingedDates(response.data);
            } else {
                alert(response?.data ? response.data : 'Could not fetch assinged dates.');
            }
        }).catch((_) => console.log('Could not get assinged dates.'))
            .finally(() => setLoading(false));
    }

    const handleDelete = (item) => {
        Alert.alert('Are you sure?', `${dateFormat(new Date(item.dateAssigned), "dd mmm yyyy")} will be deleted permanently.`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        const model = {
                            dateAssigned: item.dateAssigned
                        };
                        assignedDateApi.deleteAssingedDates(model).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete.');
                            }
                            fetchAssignedDates();
                        }).catch((err) => console.log(err)).finally(() => setLoading(false));
                    }
                }
            ]);
    }

    const getTotalAssigned = () => {
        return assingedDates.length;
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
                                    fetchAssignedDates(value);
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
                            <AppText>Total Assinged: {getTotalAssigned()}</AppText>
                        </View>
                    </View>
                    {assingedDates.length > 0 &&
                        <View style={styles.flatListContainer}>
                            <FlatList
                                data={assingedDates}
                                keyExtractor={date => date.dateAssigned.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={[styles.itemContainer, { paddingRight: isManager ? 0 : 10 }]}>
                                        <View style={styles.rowDetailContainer}>
                                            <MaterialCommunityIcons size={20} name="calendar" color={colors.mediumGray} />
                                            <AppText style={styles.titleText}>{dateFormat(new Date(item.dateAssigned), "dd mmm yyyy")}</AppText>
                                        </View>
                                        <View style={styles.rowDetailContainer}>
                                            <MaterialCommunityIcons size={20} name="account" color={colors.mediumGray} />
                                            <AppText style={styles.titleText}>{item.memberAssigned}</AppText>
                                        </View>
                                        {isManager && <View>
                                            <IconButton name="trash-can" bgColor={colors.danger} size={30} onPress={() => handleDelete(item)} />
                                        </View>}
                                    </View>
                                )}
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
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        minHeight: 50
    },
    rowDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    titleText: {
        fontSize: 16,
        marginLeft: 2,
        color: colors.mediumGray
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

export default AssignedDatesScreen;