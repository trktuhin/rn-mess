import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Yup from 'yup';

import ActivityIndication from '../../../components/ActivityIndicator';
import { AppForm, AppFormField } from '../../../components/form';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import AppDatePicker from '../../../components/form/AppDatePicker';
import fixedExpenseApi from '../../../api/fixedExpense';
import useAuth from '../../../auth/useAuth';
import useIsMounted from '../../../hooks/useIsMounted';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title should not be empty').min(5).max(30).label('Expense Title'),
    amount: Yup.number().typeError('Expense Amount must be a valid number').required().min(1).label('Expense Amount'),
    effectiveDate: Yup.date().required().label('Expense Date'),
    remarks: Yup.string().max(30)
});


function NewEditFixedExpenseScreen({ route, navigation }) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const { decodedToken } = useAuth();
    const selectedExpense = route.params?.fixedExpense ? route.params.fixedExpense : null;
    const formRef = useRef();
    const id = route.params?.id;
    const mode = id === 0 ? "New" : "Edit";

    useEffect(() => {
        decodedToken().then(option => {
            if (option?.messRole == "admin" || option?.messRole == "manager") {
                if (isMounted.current) setIsManager(true);
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
            else {
                navigation.setOptions({ title: "Fixed Expense Details" });
            }
        }).catch(err => console.log(err));

    }, [route, navigation]);

    const handleSubmit = (fixedExpense) => {
        const model = {
            id: id ? id : 0,
            title: fixedExpense.title,
            amount: fixedExpense.amount,
            effectiveDate: fixedExpense.effectiveDate,
            remarks: fixedExpense.remarks
        };
        if (mode == "New") {
            if (isMounted.current) setLoading(true);
            fixedExpenseApi.addFixedExpense(model).then(res => {
                navigation.pop();
            }).catch((_) => {
                return alert('Could not add new fixed expense.');
            }).finally(() => { if (isMounted.current) setLoading(false) });
        }
        else {
            if (isMounted.current) setLoading(true);
            fixedExpenseApi.updateFixedExpense(model).then(res => {
                navigation.pop();
            }).catch((_) => console.log('Failed to edit.'))
                .finally(() => { if (isMounted.current) setLoading(false) });
        }
    }

    const handleDelete = () => {
        Alert.alert('Are you sure?', `${selectedExpense.title} will be deleted permanently.`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        if (isMounted.current) setLoading(true);
                        fixedExpenseApi.deleteFixedExpense(id).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete fixed expense');
                            }
                            navigation.pop();
                        }).catch((err) => console.log(err))
                            .finally(() => { if (isMounted.current) setLoading(false) });
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
                {(mode == "New" || (mode !== "New" && selectedExpense != null)) && <AppForm
                    initialValues={{
                        title: selectedExpense?.title ? selectedExpense.title : '',
                        amount: selectedExpense?.amount ? selectedExpense?.amount.toString() : '0',
                        effectiveDate: selectedExpense?.effectiveDate ? selectedExpense?.effectiveDate : '',
                        remarks: selectedExpense?.remarks ? selectedExpense.remarks : '',
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    formRef={formRef}
                >
                    <AppFormField editable={isManager} icon="format-title" name="title" maxLength={255} placeholder="Expense Title" />
                    <AppFormField prefix="৳" name="amount" keyboardType="numeric" placeholder="Expense Amount" />
                    <AppDatePicker enabled={isManager} label="Expense Date" initaialDate={selectedExpense?.effectiveDate ? new Date(selectedExpense.effectiveDate) : null} name="effectiveDate" mode="date" placeholder="Expense Date" />
                    <AppFormField editable={isManager} icon="comment" name="remarks" maxLength={255} placeholder="Remarks" />
                </AppForm>}
                <View style={styles.bottomOptions}>
                    {(isManager && selectedExpense) && <IconButton name="trash-can" bgColor={colors.danger} onPress={handleDelete} />}
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

export default NewEditFixedExpenseScreen;