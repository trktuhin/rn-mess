import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import colors from '../../config/colors';
import AppText from '../AppText';
import globalVariables from '../../globalVariables';
import IconButton from '../IconButton';
import routes from '../../navigation/routes';

function DepositList({ memberId, isManager = false, firstName, lastName, totalDebit = 0, totalCredit = 0, photoName }) {
    const navigation = useNavigation();
    const onDepositNavigation = (mode = "Add") => {
        navigation.navigate(routes.ADDWITHDRAWDEPOSIT, { mode: mode, memberId: memberId });
    }
    return (
        <View style={styles.listContainer}>
            <View style={styles.detailContainer}>
                <View>
                    <Image style={styles.image} source={photoName ? { uri: globalVariables.IMAGE_BASE + photoName } : require("../../assets/defaultuser.jpg")} />
                </View>
                <View style={styles.rightPart}>
                    <AppText style={styles.primaryText}>{firstName} {lastName}</AppText>
                    <AppText style={styles.secondaryText}>৳ {(totalDebit - totalCredit).toFixed(2)}</AppText>
                </View>

            </View>
            <View style={styles.lastPart}>
                <View style={styles.buttonContainer}>
                    {isManager && <IconButton onPress={() => onDepositNavigation('Add')} name="plus" bgColor={colors.primary} style={styles.iconContainer} />}
                    {isManager && <IconButton onPress={() => onDepositNavigation('Withdraw')} name="minus" bgColor={colors.danger} style={styles.iconContainer} />}
                    <IconButton onPress={() => navigation.navigate(routes.DEPOSITHISTORY, { id: memberId, name: `${firstName} ${lastName}` })} name="history" bgColor={colors.darkYellow} style={styles.iconContainer} />
                </View>
            </View>
        </View>
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
        flex: 1,
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
    }
});

export default DepositList;