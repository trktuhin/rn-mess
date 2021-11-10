import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppText';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import useAuth from '../../auth/useAuth';

function SuccessfulScreen({ navigation }) {
    const animSize = useState(new Animated.Value(280))[0];
    const { logout } = useAuth();

    useEffect(() => {
        Animated.timing(animSize, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }, []);

    const goToLoginPage = () => {
        logout();
        navigation.replace(routes.LOGIN);
    }

    return (
        <View style={styles.container}>
            <AppText style={styles.heading1}>Congratulations!</AppText>
            <AppText style={styles.heading2}>You are now a verified user.</AppText>
            <Animated.View style={{ paddingTop: animSize }}>
                <IconButton name="thumb-up" size={80} color={colors.lightYellow} bgColor="#b812ad" />
                <AppButton bgColor="mediumGray" title="Sign In Now" onPress={goToLoginPage} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading1: {
        color: colors.white,
        fontSize: 35,
        fontWeight: 'bold'
    },
    heading2: {
        fontSize: 25
    }
});

export default SuccessfulScreen;