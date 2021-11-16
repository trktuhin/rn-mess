import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dateFormat from "dateformat";

import colors from '../../config/colors';
import AppText from '../AppText';

function DailyExpenseList({ day, totalMeal, totalExpense, responsibleMember, onPress }) {
    return (
        <TouchableNativeFeedback underlayColor={colors.lightGray} onPress={onPress}>
            <View style={styles.listContainer}>
                <View style={styles.detailContainer}>
                    <View>
                        <AppText style={styles.primaryText}>{dateFormat(new Date(day), "dd mmm yyyy")}</AppText>
                        <AppText style={styles.secondaryText}>Meals: {totalMeal}</AppText>
                    </View>
                    <View>
                        <AppText style={styles.primaryText}>৳ {totalExpense}</AppText>
                        <AppText style={styles.secondaryText}>By: {responsibleMember}</AppText>
                    </View>
                </View>
                <MaterialCommunityIcons color={colors.mediumGray} name="chevron-right" size={25} />
            </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.white,
        justifyContent: 'space-between',
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
        flexDirection: 'row',
        flex: .8,
        justifyContent: 'space-between'
    },
    primaryText: {
        fontWeight: 'bold'
    },
    secondaryText: {
        fontSize: 14,
        color: colors.mediumGray
    }
});

export default DailyExpenseList;