import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Yup from 'yup';

import ActivityIndication from '../../../components/ActivityIndicator';
import { AppForm, AppFormField } from '../../../components/form';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import AppDatePicker from '../../../components/form/AppDatePicker';
import sessionApi from '../../../api/session';
import useAuth from '../../../auth/useAuth';

const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(5).label('Session Title'),
    sessionStart: Yup.date().required().label('Session Start Date'),
    sessionEnd: Yup.date().required().label('Session End Date')
});

function NewEditSessionScreen({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { decodedToken } = useAuth();
    const selectedSession = route.params?.currentSession ? route.params.currentSession : null;
    const formRef = useRef();
    const id = route.params?.id;
    const mode = id === 0 ? "New" : "Edit";

    useEffect(() => {
        decodedToken().then(option => {
            if (option?.messRole == "admin") {
                setIsAdmin(true);
                navigation.setOptions({
                    headerRight: () => (
                        <IconButton name='check' bgColor={colors.primary} onPress={() => {
                            if (formRef.current) {
                                formRef.current.handleSubmit()
                            }
                        }} />
                    ),
                });
            }
        }).catch(err => console.log(err));
    }, [route, navigation]);

    const handleSubmit = (session) => {
        const model = {
            id: id ? id : 0,
            title: session.title,
            sessionStart: session.sessionStart,
            sessionEnd: session.sessionEnd
        };
        if (mode == "New") {
            setLoading(true);
            sessionApi.addSession(model).then(res => {
                navigation.pop();
            }).catch((_) => {
                return alert('Could not add new session.');
            }).finally(() => setLoading(false));
        }
        else {
            setLoading(true);
            sessionApi.updateSession(model).then(res => {
                navigation.pop();
            }).catch((_) => console.log('Failed to edit.')).finally(() => setLoading(false));
        }
    }

    const handleDelete = () => {
        Alert.alert('Are you sure?', `${selectedSession.title} will be deleted permanently.`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        sessionApi.deleteSession(id).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete session');
                            }
                            navigation.pop();
                        }).catch((err) => console.log(err)).finally(() => setLoading(false));
                    }
                }
            ]);
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            <View style={styles.container}>
                {loading && <ActivityIndication visible={loading} />}
                {(mode == "New" || (mode !== "New" && selectedSession != null)) && <AppForm
                    initialValues={{
                        title: selectedSession?.title ? selectedSession.title : '',
                        sessionStart: selectedSession?.sessionStart ? selectedSession.sessionStart : '',
                        sessionEnd: selectedSession?.sessionEnd ? selectedSession.sessionEnd : '',
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    formRef={formRef}
                >
                    <AppFormField icon="calendar-account" name="title" maxLength={255} placeholder="Session Title" />
                    <AppDatePicker label="Session Start" initaialDate={selectedSession?.sessionStart ? new Date(selectedSession.sessionStart) : null} name="sessionStart" mode="date" placeholder="Session Start" />
                    <AppDatePicker label="Session End" initaialDate={selectedSession?.sessionEnd ? new Date(selectedSession.sessionEnd) : null} name="sessionEnd" mode="date" placeholder="Session End" />
                </AppForm>}
                <View style={styles.bottomOptions}>
                    {(isAdmin && selectedSession) && <IconButton name="trash-can" bgColor={colors.danger} onPress={handleDelete} />}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    bottomOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

export default NewEditSessionScreen;