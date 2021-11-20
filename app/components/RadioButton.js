import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

function RadioButton({ title, onPress, isSelected = false }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.radioContainer}>
                <View style={styles.theDotContainer}>
                    <View style={[styles.theDot, { backgroundColor: isSelected == true ? colors.primary : colors.lightGray }]}>
                    </View>
                </View>
                <View style={styles.title}>
                    <AppText>{title}</AppText>
                </View>
            </View>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    theDotContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'gray',
        padding: 5,
    },
    theDot: {
        height: '100%',
        width: '100%',
        borderRadius: 15
    },
    title: {
        marginLeft: 5
    }
});

export default RadioButton;