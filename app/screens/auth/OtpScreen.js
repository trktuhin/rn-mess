import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import AppText from '../../components/AppText';
import Screen from '../../components/Screen';
import AppTextInput from '../../components/AppTextInput';
import colors from '../../config/colors';
import AppButton from '../../components/AppButton';
import routes from '../../navigation/routes';
import authApi from '../../api/auth';
import ActivityIndication from '../../components/ActivityIndicator';

function OtpScreen({ navigation }) {
    const [otpValue, setOtpValue] = useState();
    const [loading, setLoading] = useState(false);
    const submitOtp = async () => {
        if (!otpValue) {
            return alert('Please enter your OTP');
        }
        if (!otpValue.match(/^\d{4}$/)) {
            return alert('Invalid OTP');
        }
        setLoading(true);
        var response = await authApi.verifyOtp(otpValue);
        if (response.status != null) setLoading(false);
        if (!response.ok) {
            alert('Your OTP was incorrect');
            return;
        }
        navigation.replace(routes.SUCCESSFUL);

    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            <Screen style={styles.container}>
                <View>
                    <Image resizeMode="contain" style={styles.logo} source={require("../../assets/messlogo.jpg")} />
                    <AppText style={styles.instruction}>We have sent a 4 digit OTP sent to your mobile.Enter your OTP and Submit.</AppText>
                    <View style={styles.inputContainer}>
                        <AppTextInput
                            onChangeText={text => setOtpValue(text)}
                            width={200}
                            keyboardType="numeric"
                            maxLength={4}
                            value={otpValue}
                            style={styles.input}
                        />
                    </View>
                    <AppButton title="Submit OTP" onPress={submitOtp} />
                </View>
            </Screen>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20
    },
    instruction: {
        textAlign: 'center',
        color: colors.mediumGray
    },
    input: {
        letterSpacing: 15,
        fontSize: 25,
        color: colors.primary,
        textAlign: 'center'
    },
    inputContainer: {
        alignItems: 'center'
    }
});

export default OtpScreen;