import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';

import depositApi from '../../../api/deposit';
import RadioButton from '../../../components/RadioButton';
import colors from '../../../config/colors';
import ActivityIndication from '../../../components/ActivityIndicator';
import AppDatePicker from '../../../components/form/AppDatePicker';
import { AppForm, AppFormField, SumbitButton } from '../../../components/form';

const validationSchema = Yup.object().shape({
    amount: Yup.number().typeError('Amount should be a valid number').min(1).required().label('Amount'),
    effectiveDate: Yup.date().required().label('Deposit Date'),
    remarks: Yup.string().label('Remarks')
});

function AddWithdrawScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState(route?.params?.mode ? route.params.mode : "Add");
    const [selectedMemberId, setSelectedMemberId] = useState(route?.params?.memberId ? route.params.memberId : 0);
    const [memberDropdown, setMemberDropdown] = useState([]);
    const formRef = useRef();

    useEffect(() => {
        depositApi.getMemberDropdown().then(res => {
            if (!res.ok) {
                return alert(res.data ? res.data : 'Could not get members');
            }
            setMemberDropdown(res.data);
        }).catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = (depositForm) => {
        if (selectedMemberId == 0) {
            return alert('Please select a member first.');
        }
        const model = {
            amount: depositForm.amount,
            depositType: mode === "Add" ? 'debit' : 'credit',
            memberId: selectedMemberId,
            effectiveDate: depositForm.effectiveDate,
            remarks: depositForm.remarks
        };
        setLoading(true);
        depositApi.addDeposit(model).then(res => {
            if (!res.ok) {
                return alert('Failed to add/withdraw deposit. Try again later')
            }
            navigation.pop();
        }).catch(err => {
            return alert(err);
        }).finally(() => setLoading(false));
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            <View style={styles.container}>
                <View style={styles.radioButtonsContainer}>
                    <RadioButton
                        title="ADD"
                        onPress={() => setMode("Add")}
                        isSelected={mode == "Add" ? true : false}
                    />
                    <RadioButton
                        title="WITHDRAW"
                        onPress={() => setMode("Withdraw")}
                        isSelected={mode == "Withdraw" ? true : false}
                    />
                </View>
                {memberDropdown.length > 0 &&
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            onValueChange={(value) => {
                                setSelectedMemberId(value);
                            }}
                            placeholder={{
                                label: 'Select Member',
                                value: 0,
                                color: colors.primary,
                            }}
                            items={memberDropdown.map((member) => {
                                return {
                                    label: `${member.firstName} ${member.lastName}`,
                                    value: member.id
                                }
                            })
                            }
                            value={selectedMemberId}
                            style={pickerSelectStyles}
                        />
                    </View>}
                <View>
                    <AppForm
                        initialValues={{
                            amount: '0',
                            effectiveDate: new Date(),
                            remarks: '',
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                        formRef={formRef}
                    >
                        <AppFormField prefix="৳" name="amount" keyboardType="numeric" placeholder="Amount" />
                        <AppDatePicker label="Deposit Date" initaialDate={new Date()} name="effectiveDate" mode="date" />
                        <AppFormField icon="comment" name="remarks" maxLength={255} placeholder="Remarks" />
                        <SumbitButton title="Submit" />
                    </AppForm>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    radioButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    pickerStyle: {
        backgroundColor: colors.white,
        padding: 10,
        paddingVertical: 20,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 23,
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default AddWithdrawScreen;