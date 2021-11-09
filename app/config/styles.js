import { Platform } from 'react-native';
import colors from './colors';

export default {
    colors,
    textInput: {
        color: colors.mediumGray,
        fontSize: 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
        flex: 1
    },
    text: {
        color: colors.darkGary,
        fontSize: 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    }
}