import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';

import colors from '../config/colors';

function AppButton({ title, onPress, bgColor = "primary", ...otherProps }) {
    return (
        <View style={styles.container}>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('white', true)}
                onPress={onPress} {...otherProps}>
                <View style={[styles.button, { backgroundColor: colors[bgColor] }]}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        width: '100%',
        marginVertical: 10,
        overflow: 'hidden'
    },
    button: {
        backgroundColor: colors.primary,
        width: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: colors.white,
        fontWeight: '800',
        padding: 15,
    }
});

export default AppButton;