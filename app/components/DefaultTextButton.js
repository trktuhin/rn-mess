import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback, Text } from 'react-native';
import colors from '../config/colors';

function DefaultTextButton({ title, onPress, bgColor = "primary", style, ...otherProps }) {
    return (
        <View style={styles.container}>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('white', true)}
                onPress={onPress} {...otherProps}>
                <View style={[styles.button, { backgroundColor: colors[bgColor] }, style]}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        marginVertical: 10,
        overflow: 'hidden',
        alignItems: 'flex-start',
        marginRight: 10
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: "flex-start",
    },
    text: {
        fontSize: 15,
        color: colors.white,
        fontWeight: '800',
        padding: 8,
    }
});

export default DefaultTextButton;