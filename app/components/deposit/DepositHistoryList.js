import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import dateFormat from "dateformat";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../../config/colors';
import AppText from '../AppText';

function DepositHistoryList({ effectiveDate, debit = 0, credit = 0, remarks }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const checkExpanded = (value) => {
        setIsExpanded(value);
    }
    return (
        <Collapse style={styles.listContainer} onToggle={(value) => checkExpanded(value)}>
            <CollapseHeader style={styles.detailContainer}>
                <View>
                    <AppText style={styles.primaryText}>Date</AppText>
                    <AppText style={styles.secondaryText}>{dateFormat(new Date(effectiveDate), "dd mmm yyyy")}</AppText>
                </View>
                <View>
                    <AppText style={styles.primaryText}>ADD</AppText>
                    <AppText style={styles.secondaryText}>{debit == 0 ? '-' : `৳ ${debit}`}</AppText>
                </View>
                <View>
                    <AppText style={styles.primaryText}>WITHDRAW</AppText>
                    <AppText style={styles.secondaryText}>{credit == 0 ? '-' : `৳ ${credit}`}</AppText>
                </View>
                <MaterialCommunityIcons color={colors.mediumGray} name={isExpanded ? "chevron-down" : "chevron-right"} size={25} />
            </CollapseHeader>
            <CollapseBody>
                <View style={styles.remarksText}>
                    <AppText style={styles.secondaryText}>Remarks: {remarks == "" ? 'No remarks' : remarks}</AppText>
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
        justifyContent: 'space-around'
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
        marginTop: 5
    }
});

export default DepositHistoryList;