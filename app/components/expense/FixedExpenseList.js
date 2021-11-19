import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dateFormat from "dateformat";

import colors from '../../config/colors';
import AppText from '../AppText';

function FixedExpenseList({ title, expenseDate, totalExpense, remarks, onPress }) {
    return (
        <TouchableNativeFeedback underlayColor={colors.lightGray} onPress={onPress}>
            <View style={styles.listContainer}>
                <View style={styles.detailContainer}>
                    <View>
                        <AppText style={styles.primaryText}>{title}</AppText>
                        <AppText style={styles.secondaryText}>{dateFormat(new Date(expenseDate), "dd mmm yyyy")}</AppText>
                    </View>
                    <View style={styles.rightPart}>
                        <AppText style={styles.primaryText}>৳ {totalExpense}</AppText>
                        <AppText style={styles.secondaryText}>{remarks ? remarks : 'No remarks'}</AppText>
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
        flex: .98,
        // justifyContent: 'space-evenly',
    },
    rightPart: {
        marginLeft: 40
    },
    primaryText: {
        fontWeight: 'bold'
    },
    secondaryText: {
        fontSize: 14,
        color: colors.mediumGray
    }
});

export default FixedExpenseList;