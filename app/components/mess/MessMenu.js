import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ListItem from '../list/ListItem';
import Icon from '../Icon';
import routes from '../../navigation/routes';

function MessMenu() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ListItem
                style={styles.listItem}
                title="Daily Expense"
                IconComponent={<Icon name="view-list" bgColor="#7018c9" />}
                onPress={() => { navigation.navigate(routes.DAILYEXPENSES) }} />
            <ListItem
                style={styles.listItem}
                title="Fixed Expense"
                IconComponent={<Icon name="note-outline" bgColor="#c918a9" />}
                onPress={() => { navigation.navigate(routes.FIXEDEXPENSES) }} />

            <ListItem
                style={styles.listItem}
                title="Sessions"
                IconComponent={<Icon name="calendar-range" bgColor="#187fc9" />}
                onPress={() => { navigation.navigate(routes.SESSIONS) }} />
            <ListItem
                style={styles.listItem}
                title="Deposits"
                IconComponent={<Icon name="cash-multiple" bgColor="#18c9a9" />}
                onPress={() => { }} />
            <ListItem
                style={styles.listItem}
                title="Assigned Dates"
                IconComponent={<Icon name="calendar-check" bgColor="#18c956" />}
                onPress={() => { }} />
            <ListItem
                style={styles.listItem}
                title="Update Mess"
                IconComponent={<Icon name="update" bgColor="#c96518" />}
                onPress={() => { navigation.navigate(routes.UPDATE_MESS) }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        alignItems: 'stretch',
        width: '100%',
    },
    listItem: {
        marginBottom: 10
    },
});

export default MessMenu;