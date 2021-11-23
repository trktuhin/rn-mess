import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import dateFormat from "dateformat";

import AppText from '../../components/AppText';
import colors from '../../config/colors';
import sessionApi from '../../api/session';
import membersApi from '../../api/member';
import ActivityIndication from '../../components/ActivityIndicator';
import ListItemSeparator from '../../components/list/ListItemSeparator';

function ViewMealsScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [meals, setMeals] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const member = route.params?.member ? route.params.member : null;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setLoading(true);
            sessionApi.getSessions().then(res => {
                setSessions(res?.data);
                if (res?.data.length > 0) {
                    const initialSessionId = res.data[0].id;
                    setSelectedSessionId(initialSessionId);
                    membersApi.viewMeals(member.id, initialSessionId).then(response => {
                        if (response.ok) {
                            setMeals(response?.data);
                        }
                    }).catch((_) => console.log('Could not get meals'))

                }
                else {
                    setSelectedSessionId(0);
                    membersApi.viewMeals(member.id, 0).then(response => {
                        if (response.ok) {
                            setMeals(response?.data);
                        }
                    }).catch((_) => console.log('Could not get meals'));
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false));
        });
        return unsubscribe;
    }, [navigation]);

    const fetchMemberMeals = (sessionId) => {
        setLoading(true);
        membersApi.viewMeals(member.id, sessionId).then(response => {
            if (response.ok) {
                setMeals(response.data);
            } else {
                alert(response?.data ? response.data : 'Could not fetch meals.');
            }
        }).catch((_) => console.log('Could not get meals.'))
            .finally(() => setLoading(false));
    }

    const getTotalMeals = () => {
        return getTotalBreakfast() + getTotalLunch() + getTotalDinner();
    }

    const getTotalBreakfast = () => {
        let b = 0;
        meals.forEach(element => {
            b += element.breakFast;
        });
        return b;
    }

    const getTotalLunch = () => {
        let l = 0;
        meals.forEach(element => {
            l += element.lunch;
        });
        return l;
    }

    const getTotalDinner = () => {
        let d = 0;
        meals.forEach(element => {
            d += element.dinner;
        });
        return d;
    }

    return (
        <>
            {loading && <ActivityIndication visible={loading} />}
            {(sessions.length > 0 && selectedSessionId != null) &&
                <View style={styles.container}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.pickerStyle}>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    setSelectedSessionId(value);
                                    fetchMemberMeals(value);
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
                            <AppText>Total Meals: {getTotalMeals()}</AppText>
                        </View>
                    </View>
                    <View style={styles.tableHeader}>
                        <View style={{ width: '34%' }}>
                            <AppText style={styles.tableHeaderText}>Date</AppText>
                        </View>
                        <View style={{ width: '22%' }}>
                            <AppText style={styles.tableHeaderText}>Breakfast</AppText>
                        </View>
                        <View style={{ width: '22%' }}>
                            <AppText style={styles.tableHeaderText}>Lunch</AppText>
                        </View>
                        <View style={{ width: '22%' }}>
                            <AppText style={styles.tableHeaderText}>Dinner</AppText>
                        </View>
                    </View>
                    {meals.length > 0 &&
                        <View style={styles.flatListContainer}>
                            <FlatList
                                data={meals}
                                keyExtractor={meal => meal.day.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={styles.tableRow}>
                                        <View style={{ width: '34%' }}>
                                            <AppText style={styles.tableRowText}>{dateFormat(new Date(item.day), "dd mmm yyyy")}</AppText>
                                        </View>
                                        <View style={{ width: '22%' }}>
                                            <AppText style={styles.tableRowText}>{item.breakFast}</AppText>
                                        </View>
                                        <View style={{ width: '22%' }}>
                                            <AppText style={styles.tableRowText}>{item.lunch}</AppText>
                                        </View>
                                        <View style={{ width: '22%' }}>
                                            <AppText style={styles.tableRowText}>{item.dinner}</AppText>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    }
                    {(meals.length == 0) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <AppText>No Meals Found.</AppText>
                    </View>}
                    <View style={styles.footer}>
                        <View style={styles.footerDetails}>
                            <AppText style={styles.footerText}>Breakfast: {getTotalBreakfast()}</AppText>
                            <AppText style={styles.footerText}>Lunch: {getTotalLunch()}</AppText>
                            <AppText style={styles.footerText}>Dinner: {getTotalDinner()}</AppText>
                        </View>
                    </View>
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
    tableHeader: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.white
    },
    tableHeaderText: {
        color: colors.primary,
        textAlign: 'center'
    },
    tableRow: {
        paddingVertical: 5,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.white
    },
    tableRowText: {
        color: colors.mediumGray,
        textAlign: 'center',
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

export default ViewMealsScreen;