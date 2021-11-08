import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import * as Yup from 'yup';

import { AppForm, AppFormField } from '../../components/form';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().min(1).label('First Name'),
    lastName: Yup.string().required().min(1).label('Last Name'),
    breakfast: Yup.number().required().label('Breakfast'),
    lunch: Yup.number().required().label('Lunch'),
    dinner: Yup.number().required().label('Dinner')
});


function NewEditMemberScreen({ route, navigation }) {
    const [mode, setMode] = useState("New");
    const formRef = useRef();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton name='check' bgColor={colors.primary} onPress={() => {
                    if (formRef.current) {
                        formRef.current.handleSubmit()
                    }
                }} />
            ),
        });

        var id = route.params?.id;
        console.log(id);
        if (id !== 0) {
            setMode("Edit");
        }
    }, [route, navigation]);
    const handleSubmit = async (member, { resetForm }) => {
        console.log(member);
        resetForm();
    }
    return (
        <View style={styles.container}>
            <AppForm
                initialValues={{
                    firstName: '',
                    lastName: '',
                    breakfast: '',
                    lunch: '',
                    dinner: ''
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                formRef={formRef}
            >
                <AppFormField icon="account" name="firstName" maxLength={255} placeholder="First Name" />
                <AppFormField icon="account" name="lastName" maxLength={255} placeholder="Last Name" />
                <AppFormField icon="food-fork-drink" width={150} name="breakfast" maxLength={8} keyboardType="numeric" placeholder="Breakfast" />
                <AppFormField icon="food" width={150} name="lunch" maxLength={8} keyboardType="numeric" placeholder="Lunch" />
                <AppFormField icon="silverware-fork-knife" width={150} name="dinner" maxLength={8} keyboardType="numeric" placeholder="Dinner" />
                {/* <SumbitButton title="Post" /> */}
            </AppForm>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    }
});

export default NewEditMemberScreen;