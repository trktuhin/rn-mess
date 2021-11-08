import React, { useState } from "react";
import { Button, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormikContext } from 'formik';
import AppText from "../AppText";
import DefaultStyles from '../../config/styles';
import ErrorMessage from "./ErrorMessage";

function AppDatePicker({ name, initaialDate = new Date(), mode = "date", width = '100%', placeholder = 'Select a date' }) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [labelText, setLabelText] = useState(placeholder);
    const [selectedDate, setselectedDate] = useState(initaialDate);
    const { setFieldTouched, setFieldValue, errors, touched } = useFormikContext();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDatePickerVisibility(false);
        setLabelText(mode == "date" ? getMediumDate(date) : get12HourTime(date));
        setFieldTouched(name);
        setFieldValue(name, date);
        setselectedDate(date);
    }

    const get12HourTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const getMediumDate = (date) => {
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={showDatePicker}>
                <View style={[styles.container, { width }]}>
                    <MaterialCommunityIcons name={mode == "date" ? 'calendar-month' : 'clock-outline'} size={20} color={DefaultStyles.colors.mediumGray} style={styles.icon} />
                    <AppText>{labelText}</AppText>
                </View>
            </TouchableWithoutFeedback>
            <DateTimePickerModal
                date={selectedDate}
                isVisible={isDatePickerVisible}
                mode={mode}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 25,
        backgroundColor: DefaultStyles.colors.white,
        marginVertical: 10,
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    }
});

export default AppDatePicker;