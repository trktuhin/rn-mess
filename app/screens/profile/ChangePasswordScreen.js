import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Yup from 'yup';

import { AppForm, AppFormField, SumbitButton } from '../../components/form';
import ActivityIndication from '../../components/ActivityIndicator';
import profileApi from '../../api/profile';

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required().min(6).max(15).label('Old Password'),
    newPassword: Yup.string().required().min(6).max(15).label('New Password'),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').label("Password Confirmation")
});

function ChangePasswordScreen({ navigation }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        const model = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        };
        var response = await profileApi.changePassword(model);
        setLoading(false);
        if (!response.ok) {
            return alert("Couldn't change your password.");
        }
        navigation.pop();
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            <View style={styles.container}>
                <AppForm
                    initialValues={{
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <AppFormField
                        icon="lock"
                        name="oldPassword"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Old Password"
                        secureTextEntry
                        textContentType="password"
                    />
                    <AppFormField
                        icon="lock"
                        name="newPassword"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="New Password"
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
                    <SumbitButton title="Change Password" />
                </AppForm>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    }
});

export default ChangePasswordScreen;