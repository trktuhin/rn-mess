import React from 'react';
import { Formik } from 'formik';

function AppForm({ initialValues, onSubmit, validationSchema, children, formRef }) {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            innerRef={formRef}
        >
            {() => (
                <>
                    {children}
                </>
            )}
        </Formik>
    );
}

export default AppForm;