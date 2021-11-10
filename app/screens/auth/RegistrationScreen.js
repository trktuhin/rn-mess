import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import * as Yup from 'yup';

import AppText from '../../components/AppText';
import Screen from '../../components/Screen';
import routes from '../../navigation/routes';
import { AppForm, AppFormField, SumbitButton } from '../../components/form';
import authApi from '../../api/auth';
import ActivityIndication from '../../components/ActivityIndicator';
import useAuth from '../../auth/useAuth';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().min(2).label('First Name'),
    lastName: Yup.string().required().min(2).label('Last Name'),
    mobile: Yup.string().required().min(1).matches(/^01\d{9}$/, 'Mobile number is not valid').label('Mobile number'),
    password: Yup.string().required().min(6).max(15).label('Password'),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords must match').label("Password Confirmation")
});

function RegistrationScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    const handleSubmit = async (formData) => {
        try {
            const model = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: '+88' + formData.mobile,
                password: formData.password
            }
            setLoading(true);
            let response = await authApi.register(model);
            if (!response.ok) {
                setLoading(false);
                return alert(response.data);
            }
            response = await authApi.login('+88' + formData.mobile, formData.password);
            auth.login(response.data);
            setLoading(false);
            navigation.navigate(routes.OTP);

        } catch (error) {
            alert(error);
        }
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            <Screen style={styles.container}>
                <Image resizeMode="contain" style={styles.logo} source={require("../../assets/messlogo.jpg")} />
                <AppForm
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        mobile: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <AppFormField
                        icon="account"
                        name="firstName"
                        maxLength={255}
                        placeholder="First Name"
                    />
                    <AppFormField
                        icon="account"
                        name="lastName"
                        maxLength={255}
                        placeholder="Last Name"
                    />
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
                    <AppFormField
                        icon="lock"
                        name="confirmPassword"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Confirm Password"
                        secureTextEntry
                        textContentType="password"
                    />
                    <SumbitButton title="Sign Up" />
                </AppForm>
                <AppText style={styles.navText}>Already have account? <AppText style={styles.link} onPress={() => navigation.replace(routes.LOGIN)}>Sign In</AppText></AppText>
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

export default RegistrationScreen;