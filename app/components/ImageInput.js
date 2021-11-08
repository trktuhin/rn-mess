import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

function ImageInput({ imageUri, onSelectImage, style, size = 40 }) {
    useEffect(() => {
        requestPermission();
    }, [])

    const requestPermission = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted)
            alert('You need camera permisssion');
    }

    const handleOnPress = () => {
        if (!imageUri) selectImage();
        else Alert.alert('Delete', 'Are you sure to delete this image?', [
            { text: 'Yes', onPress: () => onSelectImage(imageUri) },
            { text: 'No' }
        ])
    }

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5
            });
            if (!result.cancelled) onSelectImage(result);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={handleOnPress}>
            <View style={[styles.container, style]}>
                {!imageUri && <MaterialCommunityIcons name="camera" size={size} color={colors.mediumGray} />}
                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.lightGray,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default ImageInput;