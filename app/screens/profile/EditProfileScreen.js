import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useFormikContext } from 'formik';
import * as Yup from 'yup';

import { AppForm, AppFormField, SumbitButton, ErrorMessage } from '../../components/form';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';
import globalVariables from '../../globalVariables';
import ImageInput from '../../components/ImageInput';
import profileApi from '../../api/profile';
import ActivityIndication from '../../components/ActivityIndicator';
import useAuth from '../../auth/useAuth';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required().min(2).label('First Name'),
    lastName: Yup.string().required().min(2).label('Last Name'),
    email: Yup.string().email().label("Email address"),
    profession: Yup.string()
});

function EditProfileScreen({ route, navigation }) {
    const [selectedImageUri, setselectedImageUri] = useState(globalVariables.IMAGE_BASE + route.params.currentUser.photoUrl);
    const [currentUser, setCurrentUser] = useState(route.params.currentUser);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const formRef = useRef();
    const { updateUser } = useAuth();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton name='check' bgColor={colors.primary} onPress={() => {
                    if (formRef.current) {
                        formRef.current.handleSubmit()
                    }
                }} />
            ),
        });


    }, [route, navigation]);

    const handleSubmit = async (profileData) => {
        setLoading(true);
        var response = await profileApi.updateProfile({ ...profileData, selectedImage });
        setLoading(false);
        if (!response.ok) {
            return alert("Couldn't update profile.");
        }
        updateUser(response.data);
        navigation.pop();
    }

    const onSelectImage = result => {
        setSelectedImage(result);
        setselectedImageUri(result.uri);
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
        >
            {loading && <ActivityIndication visible={loading} />}
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image style={styles.profilePic} source={selectedImageUri.includes("user.jpg") ? require("../../assets/defaultuser.jpg") : { uri: selectedImageUri }} />
                    <ImageInput style={styles.imagePicker} size={30} onSelectImage={onSelectImage} />
                </View>
                <AppForm
                    initialValues={{
                        firstName: currentUser ? currentUser.firstName : '',
                        lastName: currentUser ? currentUser.lastName : '',
                        email: currentUser ? currentUser.email : '',
                        profession: currentUser ? currentUser.profession : ''
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    formRef={formRef}
                >
                    <AppFormField icon="account" name="firstName" maxLength={255} placeholder="First Name" />
                    <AppFormField icon="account" name="lastName" maxLength={255} placeholder="Last Name" />
                    <AppFormField icon="email" name="email" maxLength={255} keyboardType="email-address" placeholder="Email" />
                    <AppFormField icon="briefcase" name="profession" maxLength={255} placeholder="Profession" />
                </AppForm>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderColor: colors.white,
        borderWidth: 5,
        alignSelf: 'center',
        marginVertical: 10
    },
    imagePicker: {
        width: 50,
        height: 50,
        borderColor: colors.mediumGray,
        borderWidth: 3,
        borderRadius: 25,
        position: 'absolute',
        bottom: 0,
        right: '30%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
    imageContainer: {
        alignItems: 'center'
    }
});

export default EditProfileScreen;