import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';

import colors from '../config/colors';
import AppText from './AppText';

function Card({ title, subtitle, imageUrl, onPress }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.card}>
                <Image style={styles.image} source={{ uri: imageUrl }} />
                <View style={styles.detailContainer}>
                    <AppText numberOfLines={1} style={styles.title}>{title}</AppText>
                    <AppText numberOfLines={3} style={styles.subtitle}>{subtitle}</AppText>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: colors.white,
        marginBottom: 20,
        overflow: 'hidden'
    },
    detailContainer: {
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
    },
    subtitle: {
        color: colors.secondary
    },
    title: {
        marginBottom: 7
    }
});

export default Card;