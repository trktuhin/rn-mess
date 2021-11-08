import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DefaultStyles from '../config/styles';
import colors from '../config/colors';
import AppText from './AppText';

function AppTextInput({ prefix, icon, width = '100%', ...otherProps }) {
    return (
        <View style={[styles.container, { width }]}>
            {icon && <MaterialCommunityIcons name={icon} size={20} color={DefaultStyles.colors.mediumGray} style={styles.icon} />}
            {prefix && <AppText style={styles.prefix}>{prefix}</AppText>}
            <TextInput placeholderTextColor={colors.mediumGray} style={DefaultStyles.textInput} {...otherProps} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 25,
        backgroundColor: DefaultStyles.colors.white,
        marginVertical: 10,
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    },
    prefix: {
        marginRight: 10
    }
});

export default AppTextInput;