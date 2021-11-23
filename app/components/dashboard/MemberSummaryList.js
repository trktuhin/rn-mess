import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../../config/colors';
import AppText from '../AppText';
import globalVariables from '../../globalVariables';

function MemberSummaryList({ memberSummary, otherExpense, mealRate }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const checkExpanded = (value) => {
        setIsExpanded(value);
    }
    return (
        <Collapse style={styles.listContainer} onToggle={(value) => checkExpanded(value)}>
            <CollapseHeader style={styles.detailContainer}>
                <View>
                    <Image style={styles.image} source={memberSummary.photoName ? { uri: globalVariables.IMAGE_BASE + memberSummary.photoName } : require("../../assets/defaultuser.jpg")} />
                </View>
                <View>
                    <AppText style={styles.primaryText}>{memberSummary.firstName}</AppText>
                    <AppText style={styles.secondaryText}>Deposit: ৳ {(memberSummary.totalDebit - memberSummary.totalCredit).toFixed(2)}</AppText>
                </View>

                <View>
                    <AppText style={styles.primaryText}>Balance</AppText>
                    <AppText style={[styles.secondaryText, { color: ((memberSummary.totalDebit - memberSummary.totalCredit) - (memberSummary.totalMeals * mealRate + otherExpense)) < 0 ? 'red' : 'green' }]}>৳ {((memberSummary.totalDebit - memberSummary.totalCredit) - (memberSummary.totalMeals * mealRate + otherExpense)).toFixed(2)}</AppText>
                </View>
                <MaterialCommunityIcons color={colors.mediumGray} name={isExpanded ? "chevron-down" : "chevron-right"} size={25} />
            </CollapseHeader>
            <CollapseBody>
                <View style={styles.remarksText}>
                    <AppText style={styles.secondaryText}>Total Meals: {memberSummary.totalMeals}</AppText>
                    <AppText style={styles.secondaryText}>Meal Rate: ৳ {mealRate.toFixed(2)}</AppText>
                    <AppText style={styles.secondaryText}>Meal Expense: ৳ {(memberSummary.totalMeals * mealRate).toFixed(2)}</AppText>
                    <AppText style={styles.secondaryText}>Other Expense: ৳ {otherExpense.toFixed(2)}</AppText>
                </View>
            </CollapseBody>
        </Collapse>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 15,
        backgroundColor: colors.white,
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
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    rightPart: {
        marginLeft: 10,
        justifyContent: 'center'
    },
    primaryText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    secondaryText: {
        fontSize: 14,
        color: colors.mediumGray
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    lastPart: {
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    iconContainer: {
        padding: 2
    },
    remarksText: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        marginTop: 5,
        paddingTop: 5
    }
});

export default MemberSummaryList;