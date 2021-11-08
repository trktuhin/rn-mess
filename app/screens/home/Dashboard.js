import React from 'react';
import { StyleSheet } from 'react-native';

import Screen from '../../components/Screen';
import AppDatePicker from '../../components/form/AppDatePicker';

function Dashboard(props) {
    return (
        <Screen style={styles.container}>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 50
    }
});

export default Dashboard;