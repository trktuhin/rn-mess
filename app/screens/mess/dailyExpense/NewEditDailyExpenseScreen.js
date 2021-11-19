import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, LogBox } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import ActivityIndication from '../../../components/ActivityIndicator';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import useAuth from '../../../auth/useAuth';
import AppText from '../../../components/AppText';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomTextInput from '../../../components/CustomTextInput';
import memberApi from '../../../api/member';
import expenseApi from '../../../api/dailyExpense';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import DailyExpenseForm from '../../../components/expense/DailyExpenseForm';
import AppButton from '../../../components/AppButton';

function NewEditDailyExpenseScreen({ route, navigation }) {
    const [expenseDate, setExpenseDate] = useState(route.params?.day ? new Date(route.params.day) : new Date());
    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(true);
    const [singleExpense, setSingleExpense] = useState(null);
    const [totalExpense, setTotalExpense] = useState(route.params?.totalExpense ? route.params.totalExpense.toString() : "0");
    const [selectedResponsibleMember, setSelectedResponsibleMember] = useState(route.params?.responsibleMember ? route.params.responsibleMember : null);
    const [members, setMembers] = useState([]);
    const [memberMealResource, setMemberMealResource] = useState([]);
    const { decodedToken } = useAuth();
    const id = route.params?.id;
    const mode = id === 0 ? "New" : "Edit";

    useEffect(() => {
        let isCancelled = false;
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        if (!isCancelled) {
            memberApi.getMembers().then(res => {
                setMembers(res?.data);
            }).catch(err => console.log(err))
                .finally(() => setLoading(false));

            decodedToken().then(option => {
                if (option?.messRole == "admin" || option?.messRole == "manager") {
                    setIsManager(true);
                    if (id > 0) {
                        navigation.setOptions({
                            headerRight: () => (
                                <IconButton name='trash-can' bgColor={colors.danger} onPress={handleDelete} />
                            ),
                        });
                    }
                }
                else {
                    if (id > 0) {
                        navigation.setOptions({ title: "Daily Expense Details" });
                    }
                }
            }).catch(err => console.log(err));

            if (id > 0) {
                setLoading(true);
                expenseApi.getSignleExpense(id).then(res => {
                    if (res.ok) {
                        setSingleExpense(res.data.expense);
                        setMemberMealResource(res.data.memberMeals);
                    }
                }).catch(err => console.log(err))
                    .finally(() => setLoading(false));
            }
        }
        return () => {
            isCancelled = true;
        };
    }, [route, navigation]);

    const handleDelete = () => {
        Alert.alert('Are you sure?', `This daily expense will be deleted permanently.`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        expenseApi.deleteDailyExpense(id).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete daily expense');
                            }
                            navigation.pop();
                        }).catch((err) => console.log(err)).finally(() => setLoading(false));
                    }
                }
            ]);
    }

    const handleSubmit = () => {
        if (!expenseDate) {
            return alert('No date chosen');
        }
        if (isNaN(totalExpense)) {
            setTotalExpense('0');
            return alert('Total expense should be a number');
        }
        if (!selectedResponsibleMember) {
            return alert('Select a responsible member');
        }
        if (mode === "New") {
            setLoading(true);
            const model = {
                responsibleMember: selectedResponsibleMember,
                expense: +totalExpense,
                day: expenseDate,
                members: members
            };
            expenseApi.addDailyExpense(model).then(res => {
                if (!res.ok) {
                    setLoading(false);
                    return alert(res.data ? res.data : 'Could not add new daily expnese');
                }
                navigation.pop();
            }).catch(err => console.log(err))
                .finally(() => setLoading(false));
        } else {
            const model = {
                dailyExpense: { ...singleExpense, expense: totalExpense, responsibleMember: selectedResponsibleMember },
                memberMealResources: memberMealResource
            };
            expenseApi.editDailyExpense(model).then(res => {
                if (!res.ok) {
                    setLoading(false);
                    return alert(res.data ? res.data : 'Could not edit daily expnese');
                }
                navigation.pop();
            }).catch(err => console.log(err))
                .finally(() => setLoading(false));
        }

    }

    const handleOnChangeMeal = (updatedMember, index) => {
        let newMembers = [...members];
        newMembers[index] = updatedMember;
        setMembers(newMembers);
    }

    const handleOnChangeMealEdit = (updatedMember, index) => {
        let newMembers = [...memberMealResource];
        newMembers[index] = updatedMember;
        setMemberMealResource(newMembers);
    }

    const getTotalMealsCount = () => {
        let sum = 0;
        if (mode === "New") {
            members.forEach(element => {
                sum += +element.dBreakfast;
                sum += +element.dLunch;
                sum += +element.dDinner;
            });
        } else {
            memberMealResource.forEach(element => {
                sum += +element.breakfast;
                sum += +element.lunch;
                sum += +element.dinner;
            });
        }

        return sum;
    }

    return (
        <>
            {loading && <ActivityIndication visible={loading} />}
            {(mode === "New" || singleExpense !== null) && members?.length > 0 && <View style={styles.container}>
                <View style={styles.topBarContainer}>
                    <View style={styles.topBarDetail}>
                        <AppText style={styles.label}>Date</AppText>
                        <CustomDatePicker enabled={mode === "New" ? true : false} initaialDate={expenseDate} mode="date" onChange={(date) => {
                            setExpenseDate(date);
                        }} />
                        <View style={styles.pickerStyle}>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedResponsibleMember(value)}
                                placeholder={{
                                    label: 'Select One',
                                    value: null,
                                    color: colors.primary,
                                }}
                                items={members.map((member) => {
                                    return {
                                        label: `${member.firstName} ${member.lastName}`,
                                        value: `${member.firstName} ${member.lastName}`
                                    }
                                })
                                }
                                disabled={!isManager}
                                value={selectedResponsibleMember ? selectedResponsibleMember : null}
                                style={pickerSelectStyles}
                            />
                        </View>
                    </View>
                    <View style={styles.topBarDetail}>
                        <AppText style={styles.label}>Expense</AppText>
                        <CustomTextInput prefix="৳" editable={isManager} value={totalExpense} keyboardType="numeric" onChangeText={(value) => {
                            setTotalExpense(value);
                        }} />
                        <View style={styles.totalMealLabel}>
                            <AppText>Total Meals: {getTotalMealsCount()}</AppText>
                        </View>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.flatListContainer}>
                        {(members.length > 0 && mode === "New") &&
                            <FlatList
                                data={members}
                                keyExtractor={member => member.id.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => <DailyExpenseForm
                                    member={item}
                                    index={index}
                                    onChange={handleOnChangeMeal}
                                />}
                            />
                        }
                        {(memberMealResource.length > 0 && mode !== "New") &&
                            <FlatList
                                data={memberMealResource}
                                keyExtractor={member => member.memberId.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => <DailyExpenseForm
                                    member={item}
                                    index={index}
                                    onChange={handleOnChangeMealEdit}
                                    mode="Edit"
                                    isManager={isManager}
                                />}
                            />
                        }
                    </View>
                    {((mode === "New" && members.length > 0) || memberMealResource.length > 0) && isManager && <AppButton title="Submit" onPress={handleSubmit} />}
                </ScrollView>
            </View>}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        padding: 10,
        paddingBottom: 0
    },
    topBarContainer: {
        flexDirection: 'row',
        paddingBottom: 10,
        justifyContent: 'space-between',
    },
    topBarDetail: {
        marginRight: 10,
        flex: 1
    },
    label: {
        color: colors.mediumGray,
        marginLeft: 10,
        marginBottom: 2,
    },
    pickerStyle: {
        backgroundColor: colors.white,
        padding: 10,
        marginRight: 5,
        zIndex: 100,
    },
    totalMealLabel: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingBottom: 2
    },
    flatListContainer: {
        flex: 1
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
export default NewEditDailyExpenseScreen;