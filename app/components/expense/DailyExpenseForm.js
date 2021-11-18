import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import AppText from '../AppText';
import CustomTextInput from '../CustomTextInput';
import colors from '../../config/colors';
import globalVariables from '../../globalVariables';

function DailyExpenseForm({ member, index, onChange }) {
    const [breakfast, setBreakfast] = useState(member.dBreakfast.toString());
    const [lunch, setLunch] = useState(member.dLunch.toString());
    const [dinner, setDinner] = useState(member.dDinner.toString());

    const totalMealforMember = () => {
        let meal = 0;
        try {
            meal += +member.dBreakfast + member.dLunch + member.dDinner;
        } catch (error) { }
        return meal;
    }

    const onBreakfastChange = (value) => {
        if (isNaN(value)) {
            return setBreakfast('0');
        }
        setBreakfast(value);
        var updatedMember = { ...member, dBreakfast: +value };
        onChange(updatedMember, index);
    }

    const onLuchChange = (value) => {
        if (isNaN(value)) {
            return setLunch('0');
        }
        setLunch(value);
        var updatedMember = { ...member, dLunch: +value };
        onChange(updatedMember, index);
    }

    const onDinnerChange = (value) => {
        if (isNaN(value)) {
            return setDinner('0');
        }
        setDinner(value);
        var updatedMember = { ...member, dDinner: +value };
        onChange(updatedMember, index);
    }

    return (
        <View style={[styles.listContainer]}>
            <Image style={styles.image} source={member.photoName ? { uri: globalVariables.IMAGE_BASE + member.photoName } : require("../../assets/defaultuser.jpg")} />
            <View style={styles.detailContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <AppText>{`${member.firstName} ${member.lastName}`}</AppText>
                    <AppText>{`Meals: ${totalMealforMember()}`}</AppText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CustomTextInput onChangeText={(text) => onBreakfastChange(text)} value={breakfast} keyboardType="numeric" width={60} />
                    <CustomTextInput onChangeText={(text) => onLuchChange(text)} value={lunch} keyboardType="numeric" width={60} />
                    <CustomTextInput onChangeText={(text) => onDinnerChange(text)} value={dinner} keyboardType="numeric" width={60} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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

export default DailyExpenseForm;