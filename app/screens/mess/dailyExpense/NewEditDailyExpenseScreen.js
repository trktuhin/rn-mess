import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, Image } from 'react-native';
import * as Yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';

import ActivityIndication from '../../../components/ActivityIndicator';
import { AppForm, AppFormField } from '../../../components/form';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import useAuth from '../../../auth/useAuth';
import AppText from '../../../components/AppText';
import CustomDatePicker from '../../../components/CustomDatePicker';
import CustomTextInput from '../../../components/CustomTextInput';
import memberApi from '../../../api/member';
import ListItemSeparator from '../../../components/list/ListItemSeparator';

function NewEditDailyExpenseScreen(props) {
    const [expenseDate, setExpenseDate] = useState();
    const [totalExpense, setTotalExpense] = useState("");
    const [selectedResponsibleMemberId, setSelectedResponsibleMemberId] = useState(0);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        memberApi.getMembers().then(res => {
            console.log('members', res?.data);
            setMembers(res?.data);
        }).catch(err => console.log(err));
    }, []);

    return (

        <View style={styles.container}>
            <View style={styles.topBarContainer}>
                <View style={styles.topBarDetail}>
                    <AppText style={styles.label}>Date</AppText>
                    <CustomDatePicker mode="date" onChange={(date) => setExpenseDate(date)} />
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            onValueChange={(value) => setSelectedResponsibleMemberId(value)}
                            placeholder={{
                                label: 'Select One',
                                value: 0,
                                color: colors.primary,
                            }}
                            items={members.map((member) => {
                                return {
                                    label: `${member.firstName} ${member.lastName}`,
                                    value: member.id
                                }
                            })
                            }
                            style={pickerSelectStyles}
                        />
                    </View>
                </View>
                <View style={styles.topBarDetail}>
                    <AppText style={styles.label}>Expense</AppText>
                    <CustomTextInput value={totalExpense} keyboardType="numeric" onChangeText={(value) => setTotalExpense(value)} />
                    <View style={styles.totalMealLabel}>
                        <AppText>Total Meals: 21</AppText>
                    </View>
                </View>
            </View>
            <View style={styles.flatListContainer}>
                {members.length > 0 &&
                    <FlatList
                        data={members}
                        keyExtractor={member => member.id.toString()}
                        ItemSeparatorComponent={ListItemSeparator}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <View style={[styles.listContainer]}>
                                <Image style={styles.image} source={require("../../../assets/defaultuser.jpg")} />
                                <View style={styles.detailContainer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <AppText>{`${item.firstName} ${item.lastName}`}</AppText>
                                        <AppText>{`Meals: 2`}</AppText>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <CustomTextInput value={item.dBreakfast.toString()} keyboardType="numeric" width={60} />
                                        <CustomTextInput value={item.dLunch.toString()} keyboardType="numeric" width={60} />
                                        <CustomTextInput value={item.dDinner.toString()} keyboardType="numeric" width={60} />
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: 5,
        paddingBottom: 120
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
        paddingBottom: 120,
    },
    listContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        marginBottom: 5,
    },
    detailContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        flex: 1
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
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