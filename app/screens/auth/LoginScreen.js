import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import * as Yup from 'yup';
import * as SecureStore from 'expo-secure-store';

import AppText from '../../components/AppText';
import Screen from '../../components/Screen';
import routes from '../../navigation/routes';
import { AppForm, AppFormField, SumbitButton, ErrorMessage } from '../../components/form';
import authApi from '../../api/auth';
import ActivityIndication from '../../components/ActivityIndicator';
import useAuth from '../../auth/useAuth';
import authStorage from '../../auth/storage';

const validationSchema = Yup.object().shape({
    mobile: Yup.string().required().min(1).matches(/^01\d{9}$/, 'Mobile number is not valid').label('Mobile number'),
    password: Yup.string().required().min(6).max(15).label('Password')
});

function LoginScreen({ navigation }) {
    const [loginFailed, setLoginFailed] = useState(false);
    const [lastMobile, setLastMobile] = useState(null);
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled) {
            SecureStore.getItemAsync('lastLoggedInMobile').then(data => {
                if (data) {
                    setLastMobile(data);
                }
                else {
                    setLastMobile("01");
                }
            }).catch(err => {
                setLastMobile("01");
            });
        }
        return () => {
            isCancelled = true;
        };
    }, []);

    const handleSubmit = async ({ mobile, password }) => {
        setLoading(true);
        const response = await authApi.login('+88' + mobile, password);
        if (response.status != null) setLoading(false);
        if (!response.ok) return setLoginFailed(true);
        try {
            await SecureStore.setItemAsync('lastLoggedInMobile', mobile);
        } catch (error) {
            console.log('Error storing last logged in mobile', error);
        }
        setLoginFailed(false);
        auth.login(response.data);
        const user = await authStorage.getUser();
        if (!user?.isMobileVerified) {
            //send otp then navigate
            navigation.navigate(routes.OTP);
        }
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            <Screen style={styles.container}>
                <Image resizeMode="contain" style={styles.logo} source={require("../../assets/messlogo.jpg")} />
                <ErrorMessage error="Invalid mobile and/or password." visible={loginFailed} />
                {lastMobile && <AppForm
                    initialValues={{
                        mobile: lastMobile,
                        password: ''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <AppFormField
                        icon="cellphone"
                        prefix="+88"
                        name="mobile"
                        maxLength={255}
                        placeholder="Mobile"
                        keyboardType="numeric"
                    />
                    <AppFormField
                        icon="lock"
                        name="password"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        secureTextEntry
                        textContentType="password"
                    />
                    <SumbitButton title="Sign In" />
                </AppForm>}

                <AppText style={styles.navText}>Don't have account? <AppText style={styles.link} onPress={() => navigation.replace(routes.REGISTER)}>Sign up</AppText></AppText>
            </Screen>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 20
    },
    link: {
        color: 'blue'
    },
    navText: {
        textAlign: 'center'
    }
});

export default LoginScreen;