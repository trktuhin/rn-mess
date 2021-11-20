import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';

function IconButton({ name, color, bgColor, size, onPress, style }) {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Icon name={name} iconColor={color} bgColor={bgColor} size={size} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});

export default IconButton;