import React from 'react';
import { View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

function Icon({ size = 40, bgColor = colors.black, iconColor = colors.white, name }) {
    return (
        <View style={{
            backgroundColor: bgColor,
            height: size,
            width: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <MaterialCommunityIcons size={size * 0.5} name={name} color={iconColor} />
        </View>
    );
}


export default Icon;