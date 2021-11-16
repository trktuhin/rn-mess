import React from 'react';
import { View, StyleSheet, TextInput, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DefaultStyles from '../config/styles';
import colors from '../config/colors';
import AppText from './AppText';

function CustomTextInput({ prefix, icon, width = '100%', style, ...otherProps }) {
    return (
        <View style={[styles.container, { width }]}>
            {icon && <MaterialCommunityIcons name={icon} size={20} color={DefaultStyles.colors.mediumGray} style={styles.icon} />}
            {prefix && <AppText style={styles.prefix}>{prefix}</AppText>}
            <TextInput placeholderTextColor={colors.mediumGray} style={[styles.textInput, style]} {...otherProps} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 5,
        borderRadius: 15,
        backgroundColor: DefaultStyles.colors.white,
        marginVertical: 2,
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    },
    prefix: {
        marginRight: 10
    },
    textInput: {
        color: colors.mediumGray,
        fontSize: 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
        flex: 1,
        paddingLeft: 10
    }
});

export default CustomTextInput;