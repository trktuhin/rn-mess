import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import * as Yup from 'yup';

import { AppForm, AppFormField, SumbitButton } from '../../components/form';
import AppDatePicker from '../../components/form/AppDatePicker';
import messApi from '../../api/mess';
import ActivityIndication from '../../components/ActivityIndicator';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';
import ListItem from '../../components/list/ListItem';

const messFormValidationSchema = Yup.object().shape({
    messName: Yup.string().required().min(1).label('Mess Name'),
    location: Yup.string().required().min(1).label('Location'),
    updateTimeFrom: Yup.date().required().label('Update Time From'),
    updateTimeTo: Yup.date().required().label('Update Time To'),
    secretCode: Yup.string().required().min(4).max(4).label('Secret Code')
});

function UpdateMessScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [messData, setMessData] = useState();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            messApi.getMess().then(response => {
                if (response?.data !== "You don't own a mess") {
                    setMessData(response.data);
                }
            }).catch(error => console.log(error)).finally(() => setLoading(false));
        });
        return unsubscribe;
    }, [navigation]);
    const handleSubmitMessForm = async (messFormData, { resetForm }) => {
        setLoading(true);
        const model = {
            location: messFormData.location,
            mealChangeFrom: convertUTCDateToLocalDate(messFormData.updateTimeFrom),
            mealChangeTo: convertUTCDateToLocalDate(messFormData.updateTimeTo),
            secretCode: messFormData.secretCode
        };
        var response = await messApi.updateMess(model);
        setLoading(false);
        if (!response.ok) {
            return alert("Couldn't update mess.");
        }
        navigation.pop();
    }

    const convertLocalToUTCDateTime = (dateString) => {
        var date = new Date(dateString);
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        return newDate;
    }

    const convertUTCDateToLocalDate = (date) => {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);

        return newDate;
    }

    const deleteMess = () => {
        Alert.alert('Are you sure?', 'This mess will be deleted permanently', [
            { text: 'Cancel' },
            {
                text: 'Yes', onPress: () => {
                    setLoading(true);
                    var response = messApi.deleteMess().then((response) => {
                        if (!response.ok) {
                            return alert("Couldn't delete mess.");
                        }
                        navigation.pop();
                    }).catch((err) => console.log(err)).finally(() => setLoading(false))
                }
            }
        ]);
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            {messData && <View style={styles.container}>
                <AppForm
                    initialValues={{
                        messName: messData.messName,
                        location: messData.location,
                        updateTimeFrom: convertLocalToUTCDateTime(messData.mealChangeFrom),
                        updateTimeTo: convertLocalToUTCDateTime(messData.mealChangeTo),
                        secretCode: messData.secretCode
                    }}
                    onSubmit={handleSubmitMessForm}
                    validationSchema={messFormValidationSchema}
                >
                    <AppFormField editable={false} icon="city" name="messName" maxLength={255} placeholder="Mess Name" />
                    <AppFormField icon="home" name="location" maxLength={255} placeholder="Location" />
                    <AppDatePicker label="Update Time From" initaialDate={convertLocalToUTCDateTime(messData.mealChangeFrom)} name="updateTimeFrom" mode="time" placeholder="Update Time From" />
                    <AppDatePicker label="Update Time To" initaialDate={convertLocalToUTCDateTime(messData.mealChangeTo)} name="updateTimeTo" mode="time" placeholder="Update Time To" />
                    <AppFormField icon="key-star" width={150} name="secretCode" maxLength={4} keyboardType="numeric" placeholder="Secret Code" />
                    <SumbitButton title="Update Mess" />
                </AppForm>
                <View style={styles.trashContainer}>
                    <IconButton onPress={deleteMess} name="trash-can" bgColor={colors.mediumGray} size={50} />
                </View>
            </View>}
            {(!messData && !loading) && <View>
                <ListItem
                    title="Sorry!"
                    subtitle="This menu is only for Admin"
                    onPress={() => navigation.pop()}
                />
            </View>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    trashContainer: {
        alignItems: 'flex-end',
        marginTop: 10
    }
});

export default UpdateMessScreen;