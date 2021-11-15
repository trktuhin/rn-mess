import React from 'react';
import { View, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../../config/colors';
import AppText from '../AppText';

function ListItem({ image, IconComponent, title, subtitle, onPress, style }) {
    return (
        <TouchableNativeFeedback underlayColor={colors.lightGray} onPress={onPress}>
            <View style={[styles.container, style]}>
                {IconComponent}
                {image && <Image style={styles.image} source={image} />}
                <View style={styles.detailContainer}>
                    <AppText numberOfLines={1} style={styles.title}>{title}</AppText>
                    {subtitle && <AppText numberOfLines={2} style={styles.subtitle}>{subtitle}</AppText>}
                </View>
                <MaterialCommunityIcons color={colors.mediumGray} name="chevron-right" size={25} />
            </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
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
    detailContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        flex: 1
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    title: {
        fontWeight: 'bold'
    },
    subtitle: {
        color: colors.mediumGray,
    }
});

export default ListItem;