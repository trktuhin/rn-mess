import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import * as Yup from 'yup';

import AppText from '../../components/AppText';
import Screen from '../../components/Screen';
import routes from '../../navigation/routes';
import { AppForm, AppFormField, SumbitButton } from '../../components/form';

const validationSchema = Yup.object().shape({
    mobile: Yup.string().required().min(1).matches(/^01\d{9}$/, 'Mobile number is not valid').label('Mobile number'),
    password: Yup.string().required().min(6).max(15).label('Password'),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Passwords must match').label("Password Confirmation")
});

function RegistrationScreen({ navigation }) {
    const handleSubmit = async (formData, { resetForm }) => {
        console.log(formData);
        resetForm();
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            <Screen style={styles.container}>
                <Image resizeMode="contain" style={styles.logo} source={require("../../assets/messlogo.jpg")} />
                <AppForm
                    initialValues={{
                        mobile: '',
                        password: '',
                        confirmPassword: ''
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