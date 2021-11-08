import React from 'react';
import { useFormikContext } from 'formik';
import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';

function AppFormField({ name, width, ...otherProps }) {
    const { setFieldTouched, setFieldValue, values, errors, touched } = useFormikContext();
    return (
        <>
            <AppTextInput
                onBlur={() => setFieldTouched(name)}
                onChangeText={text => setFieldValue(name, text)}
                textContentType="emailAddress"
                width={width}
                value={values[name]}
                {...otherProps}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    );
}

export default AppFormField;