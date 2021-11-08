import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import colors from '../config/colors';

function TabButton({ title, onPress, isActive, bgColor = "white", ...otherProps }) {
    return (
        <TouchableWithoutFeedback
            onPress={onPress} {...otherProps}>
            <View style={[styles.button,
            {
                backgroundColor: isActive ? colors.lightGray : colors[bgColor],
                borderBottomWidth: isActive ? 2 : 0,
                borderBottomColor: isActive ? colors.secondary : null
            }
            ]}>
                <Text style={[styles.text, { color: isActive ? colors.secondary : colors.mediumGray }]}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: colors.black,
        fontWeight: '800',
        padding: 15,
    }
});

export default TabButton;