import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'

import AppText from '../AppText';
import colors from '../../config/colors';
import globalVariables from '../../globalVariables';

function MemberMealList({ member }) {
    return (
        <View style={[styles.memberMealContainer]}>
            <Image style={styles.image} source={member.photoName ? { uri: globalVariables.IMAGE_BASE + member.photoName } : require("../../assets/defaultuser.jpg")} />
            <View style={styles.memberMealDetailContainer}>
                <AppText style={styles.primaryText}>{member.firstName} {member.lastName}</AppText>
                <AppText style={styles.secondaryText}>({member.dBreakfast} + {member.dLunch} + {member.dDinner})</AppText>
            </View>
            <View style={[styles.memberMealDetailContainer]}>
                <AppText style={styles.primaryText}>Total Meals</AppText>
                <AppText style={styles.secondaryText}>{(member.dBreakfast + member.dLunch + member.dDinner)}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    memberMealContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.white,
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
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    memberMealDetailContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        flex: 1
    },
    primaryText: {
        fontWeight: 'bold'
    },
    secondaryText: {
        color: colors.mediumGray
    }
});

export default MemberMealList;