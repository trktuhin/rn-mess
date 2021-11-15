import React, { useState, useEffect } from "react";
import { Button, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormikContext } from 'formik';
import dateFormat from "dateformat";

import AppText from "../AppText";
import DefaultStyles from '../../config/styles';
import ErrorMessage from "./ErrorMessage";
import colors from "../../config/colors";

function AppDatePicker({ name, label, initaialDate, mode = "date", width = '100%', placeholder = 'Select a date' }) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [labelText, setLabelText] = useState(placeholder);
    const [selectedDate, setselectedDate] = useState(initaialDate);
    const { setFieldTouched, setFieldValue, errors, touched } = useFormikContext();

    useEffect(() => {
        if (initaialDate) {
            setLabelText(mode == "date" ? getMediumDate(initaialDate) : get12HourTime(initaialDate));
        }
    }, []);
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
        let strTime = hours + ':' + minutes + ' ' + ampm;
        if (label) {
            strTime += ` (${label})`
        }
        return strTime;
    }

    const getMediumDate = (date) => {
        let dateStr = dateFormat(date, "dd mmmm yyyy");
        if (label) {
            dateStr += ` (${label})`
        }
        return dateStr;
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={showDatePicker}>
                <View style={[styles.container, { width }]}>
                    <MaterialCommunityIcons name={mode == "date" ? 'calendar-month' : 'clock-outline'} size={20} color={DefaultStyles.colors.mediumGray} style={styles.icon} />
                    <AppText style={styles.label}>{labelText}</AppText>
                </View>
            </TouchableWithoutFeedback>
            <DateTimePickerModal
                date={selectedDate ? selectedDate : new Date()}
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
    },
    label: {
        color: colors.mediumGray
    }
});

export default AppDatePicker;