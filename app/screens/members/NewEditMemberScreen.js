import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Yup from 'yup';

import ActivityIndication from '../../components/ActivityIndicator';
import { AppForm, AppFormField } from '../../components/form';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';
import memberApi from '../../api/member';
import routes from '../../navigation/routes';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().min(1).label('First Name'),
    lastName: Yup.string().required().min(1).label('Last Name'),
    breakfast: Yup.number().required().label('Breakfast'),
    lunch: Yup.number().required().label('Lunch'),
    dinner: Yup.number().required().label('Dinner')
});


function NewEditMemberScreen({ route, navigation }) {
    const [mode, setMode] = useState("New");
    const [loading, setLoading] = useState(false);
    const [selectedMember, setselectedMember] = useState(null);
    const formRef = useRef();
    const id = route.params?.id;
    const isManual = route.params?.isManualMember;
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

        if (id !== 0) {
            setLoading(true);
            setMode("Edit");
            memberApi.getMember(id).then(response => {
                setselectedMember(response.data);
            }).catch(err => console.log(err)).finally(() => setLoading(false));
        }
    }, [route, navigation]);

    const handleSubmit = (member) => {
        const model = {
            id: id ? id : 0,
            firstName: member.firstName,
            lastName: member.lastName,
            dBreakfast: member.breakfast,
            dLunch: member.lunch,
            dDinner: member.dinner
        };
        if (mode == "New") {
            setLoading(true);
            memberApi.addMember(model).then(res => {
                navigation.pop();
            }).catch((_) => {
                return alert('Could not add new member.');
            }).finally(() => setLoading(false));
        }
        else {
            setLoading(true);
            memberApi.editMember(model).then(res => {
                if (!res.ok) {
                    setLoading(false);
                    return alert(res.data ? res.data : 'Could not fetch updated information.');
                }
                memberApi.getMember(id).then(response => {
                    navigation.navigate(routes.MEMBERDETAILS, { member: response.data })
                }).catch((_) => console.log('Could not fetch updated information.'))
                    .finally(() => setLoading(false));
            }).catch((_) => console.log('Failed to edit.'))
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            <View style={styles.container}>
                {loading && <ActivityIndication visible={loading} />}
                {(mode == "New" || (mode !== "New" && selectedMember != null)) && <AppForm
                    initialValues={{
                        firstName: selectedMember?.firstName ? selectedMember.firstName : '',
                        lastName: selectedMember?.lastName ? selectedMember.lastName : '',
                        breakfast: selectedMember?.dBreakfast ? selectedMember.dBreakfast.toString() : '0',
                        lunch: selectedMember?.dLunch ? selectedMember.dLunch.toString() : '0',
                        dinner: selectedMember?.dDinner ? selectedMember.dDinner.toString() : '0'
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    formRef={formRef}
                >
                    <AppFormField editable={isManual} icon="account" name="firstName" maxLength={255} placeholder="First Name" />
                    <AppFormField editable={isManual} icon="account" name="lastName" maxLength={255} placeholder="Last Name" />
                    <AppFormField icon="food-fork-drink" width={150} name="breakfast" maxLength={8} keyboardType="numeric" placeholder="Breakfast" />
                    <AppFormField icon="food" width={150} name="lunch" maxLength={8} keyboardType="numeric" placeholder="Lunch" />
                    <AppFormField icon="silverware-fork-knife" width={150} name="dinner" maxLength={8} keyboardType="numeric" placeholder="Dinner" />
                </AppForm>}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    }
});

export default NewEditMemberScreen;