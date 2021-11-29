import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Yup from 'yup';

import TabButton from '../TabButton';
import { AppForm, AppFormField, SumbitButton } from '../../components/form';
import AppDatePicker from '../form/AppDatePicker';
import messApi from '../../api/mess';
import ActivityIndication from '../ActivityIndicator';
import memberApi from '../../api/member';

const messFormValidationSchema = Yup.object().shape({
    messName: Yup.string().required().min(1).matches(/^[a-zA-Z0-9]*$/, 'Mess Name can not contain any white space').label('Mess Name'),
    location: Yup.string().required().min(1).label('Location'),
    updateTimeFrom: Yup.date().required().label('Update Time From'),
    updateTimeTo: Yup.date().required().label('Update Time To'),
    secretCode: Yup.string().required().min(4).max(4).label('Secret Code')
});

const messJoinValidationSchema = Yup.object().shape({
    messName: Yup.string().required().min(1).matches(/^[a-zA-Z0-9]*$/, 'Mess Name can not contain any white space').label('Mess Name'),
    secretCode: Yup.string().required().min(4).max(4).label('Secret Code')
});

function CreateJoin(props) {
    const [joinMess, setJoinMess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageX, setPageX] = useState(0);

    const handleSubmitMessForm = async (messFormData) => {
        setLoading(true);
        const model = {
            messName: messFormData.messName,
            location: messFormData.location,
            MealChangeFrom: convertUTCDateToLocalDate(messFormData.updateTimeFrom),
            MealChangeTo: convertUTCDateToLocalDate(messFormData.updateTimeTo),
            secretCode: messFormData.secretCode
        };
        var response = await messApi.createMess(model);
        setLoading(false);
        if (!response.ok) {
            return alert("Couldn't create mess.");
        }
    }

    const convertUTCDateToLocalDate = (date) => {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    const handleSubmitMessJoin = async (messJoinData) => {
        setLoading(true);
        const model = {
            messName: messJoinData.messName,
            secretCode: messJoinData.secretCode
        };
        var response = await memberApi.sendRequest(model);
        setLoading(false);
        if (!response.ok) {
            return alert(response.data ? response.data : "Couldn't send request.");
        }
        alert("Sent Request Successfully");
    }

    return (
        <View style={styles.scrollViewContainer}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
            >
                {loading && <ActivityIndication visible={loading} />}
                <View style={styles.tabContainer}>
                    <View style={styles.tabButtonContainer}>
                        <TabButton onPress={() => setJoinMess(false)} isActive={!joinMess} title="Create Mess" />
                    </View>
                    <View style={styles.tabButtonContainer}>
                        <TabButton onPress={() => setJoinMess(true)} isActive={joinMess} title="Join Mess" />
                    </View>
                </View>
                <View
                    onTouchStart={e => setPageX(e.nativeEvent.pageX)}
                    onTouchEnd={e => {
                        if ((pageX - e.nativeEvent.pageX) > 50) {
                            if (joinMess) {
                                setJoinMess(false);
                            }
                        }
                        if ((pageX - e.nativeEvent.pageX) < -50) {
                            if (joinMess == false) {
                                setJoinMess(true);
                            }
                        }
                    }}
                    style={styles.contentContainer}
                >
                    {joinMess ? <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps='handled'>
                        <AppForm
                            initialValues={{
                                messName: '',
                                secretCode: ''
                            }}
                            onSubmit={handleSubmitMessJoin}
                            validationSchema={messJoinValidationSchema}
                        >
                            <AppFormField icon="account" name="messName" maxLength={255} placeholder="Mess Name" />
                            <AppFormField icon="key-star" width={150} name="secretCode" maxLength={4} keyboardType="numeric" placeholder="Secret Code" />
                            <SumbitButton title="Send Request" />
                        </AppForm>
                    </ScrollView> :
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps='handled'
                        >
                            <AppForm
                                initialValues={{
                                    messName: '',
                                    location: '',
                                    updateTimeFrom: new Date(),
                                    updateTimeTo: new Date(),
                                    secretCode: ''
                                }}
                                onSubmit={handleSubmitMessForm}
                                validationSchema={messFormValidationSchema}
                            >
                                <AppFormField icon="city" name="messName" maxLength={255} placeholder="Mess Name" />
                                <AppFormField icon="home" name="location" maxLength={255} placeholder="Location" />
                                <AppDatePicker initaialDate={new Date()} label="Update Time From" name="updateTimeFrom" mode="time" placeholder="Update Time From" />
                                <AppDatePicker initaialDate={new Date()} label="Update Time To" name="updateTimeTo" mode="time" placeholder="Update Time To" />
                                <AppFormField icon="key-star" width={150} name="secretCode" maxLength={4} keyboardType="numeric" placeholder="Secret Code" />
                                <SumbitButton title="Create Mess" />
                            </AppForm>
                        </ScrollView>}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: '100%'
    },
    contentContainer: {
        padding: 15,
        flex: 1
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tabButtonContainer: {
        flex: 1
    }
});

export default CreateJoin;