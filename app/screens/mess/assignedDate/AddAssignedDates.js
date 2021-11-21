import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import RadioButton from '../../../components/RadioButton';
import ActivityIndication from '../../../components/ActivityIndicator';
import CustomDatePicker from '../../../components/CustomDatePicker';
import assignedDateApi from '../../../api/assignedDate';
import membersApi from '../../../api/member';
import colors from '../../../config/colors';
import AppButton from '../../../components/AppButton';

function AddAssignedDates({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("Range");
    const [assignedPerson, setAssignedPerson] = useState("");
    const [members, setMembers] = useState([]);
    const [assignDateFrom, setAssignFrom] = useState(null);
    const [assignDateTo, setAssignTo] = useState(null);
    const [customDates, setCustomDates] = useState([
        null,
        null,
        null,
        null
    ]);

    useEffect(() => {
        membersApi.getMembers().then(res => {
            if (res.ok) {
                setMembers(res.data);
            }
        }).catch(err => console.log(err)).finally(() => setLoading(false));
    }, []);

    const checkCustomDateDuplication = (index) => {
        let isDuplicate = false;
        let cDatesCopy = customDates.slice();
        cDatesCopy.splice(index, 1);
        cDatesCopy = cDatesCopy.filter(function (el) {
            return el != null;
        });
        for (var i = 0; i < cDatesCopy.length; i++) {
            const elementstr = cDatesCopy[i].toISOString().substring(0, 10);
            const currentStr = customDates[index].toISOString().substring(0, 10);
            if (elementstr == currentStr) {
                isDuplicate = true;
                break;
            }
        }
        return isDuplicate;
    }

    const updateCustomDate = (index, value) => {
        let updatedDates = [...customDates];
        updatedDates[index] = value;
        setCustomDates(updatedDates);
    }

    const checkCustomDateAvailable = async (index) => {
        if (customDates[index] == null) return true;
        const model = {
            dateAssigned: customDates[index]
        };
        const response = await assignedDateApi.isDateAvailable(model);
        if (response.status == 400) return false;
        else return true;
    }

    const handleSubmit = async () => {
        if (assignedPerson == "") {
            return alert("Please select a member.");
        }
        if (mode === "Range") {
            if (assignDateFrom == null || assignDateTo == null) {
                return alert("Please select Date From and Date To.");
            }
            if (assignDateFrom > assignDateTo) {
                return alert("Start From should be smaller than Date To.");
            }
            setLoading(true);
            const model = {
                assignDateFrom: assignDateFrom,
                assignDateTo: assignDateTo,
                memberName: assignedPerson
            };
            assignedDateApi.addRangeDays(model).then(res => {
                if (!res.ok) {
                    return alert("Could not assigned dates!");
                }
                navigation.pop();
            }).catch(err => console.log(err))
                .finally(() => setLoading(false));
        }

        if (mode !== "Range") {
            let cDatesCopy = customDates.slice();
            cDatesCopy = cDatesCopy.filter(function (el) {
                return el != null;
            });
            if (cDatesCopy.length == 0) {
                return alert('Please select atleast one date');
            }
            let isDuplicate = false;
            for (var i = 0; i < 4; i++) {
                if (customDates[i] == null) continue;
                isDuplicate = checkCustomDateDuplication(i);
                if (isDuplicate) {
                    break;
                }
            }
            if (isDuplicate) {
                return alert('Duplicate Date exists');
            }
            let isAvailable = true;
            setLoading(true);
            for (var i = 0; i < 4; i++) {
                isAvailable = await checkCustomDateAvailable(i);
                if (isAvailable == false) {
                    alert(`Date ${i + 1} is not available.`);
                    break;
                }
            }
            if (isAvailable == false) {
                setLoading(false);
                return;
            }
            const model = {
                datesToAssigned: cDatesCopy,
                memberName: assignedPerson
            };
            assignedDateApi.addMultipleDays(model).then(res => {
                if (!res.ok) {
                    return alert("Could not assigned dates!");
                }
                navigation.pop();
            }).catch(err => console.log(err))
                .finally(() => setLoading(false));
        }
    }

    return (
        <>
            {loading && <ActivityIndication visible={loading} />}
            <View style={styles.container}>
                {members.length > 0 &&
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            onValueChange={(value) => {
                                setAssignedPerson(value);
                            }}
                            placeholder={{
                                label: 'Select Member',
                                value: "",
                                color: colors.primary,
                            }}
                            items={members.map((member) => {
                                return {
                                    label: `${member.firstName} ${member.lastName}`,
                                    value: `${member.firstName} ${member.lastName}`
                                }
                            })
                            }
                            value={assignedPerson}
                            style={pickerSelectStyles}
                        />
                    </View>}
                <View style={styles.radioButtonsContainer}>
                    <RadioButton
                        title="RANGE"
                        onPress={() => setMode("Range")}
                        isSelected={mode == "Range" ? true : false}
                    />
                    <RadioButton
                        title="CUSTOM"
                        onPress={() => setMode("Custom")}
                        isSelected={mode == "Custom" ? true : false}
                    />
                </View>
                {(mode === "Range") && <View style={styles.dateContainer}>
                    <CustomDatePicker placeholder="Date From" initaialDate={assignDateFrom} mode="date" onChange={(date) => setAssignFrom(date)} />
                    <CustomDatePicker placeholder="Date To" initaialDate={assignDateTo} mode="date" onChange={(date) => setAssignTo(date)} />
                </View>}
                {(mode !== "Range") && <View style={styles.dateContainer}>
                    <CustomDatePicker placeholder="Date 1" initaialDate={customDates[0]} mode="date" onChange={(date) => updateCustomDate(0, date)} />
                    <CustomDatePicker placeholder="Date 2" initaialDate={customDates[1]} mode="date" onChange={(date) => updateCustomDate(1, date)} />
                    <CustomDatePicker placeholder="Date 3" initaialDate={customDates[2]} mode="date" onChange={(date) => updateCustomDate(2, date)} />
                    <CustomDatePicker placeholder="Date 4" initaialDate={customDates[3]} mode="date" onChange={(date) => updateCustomDate(3, date)} />
                </View>}
                <AppButton title="Submit" onPress={handleSubmit} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    pickerStyle: {
        backgroundColor: colors.white,
        padding: 10,
        paddingVertical: 20,
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 23,
    },
    radioButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    dateContainer: {
        marginTop: 20
    }
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

export default AddAssignedDates;