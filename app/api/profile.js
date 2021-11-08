import client from './client';

const updateProfile = (profileData) => {
    const data = new FormData();
    data.append('firstName', profileData.firstName);
    data.append('lastName', profileData.lastName);
    data.append('email', profileData.email);
    data.append('profession', profileData.profession);

    if (profileData.selectedImage != null) {
        let result = profileData.selectedImage;
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let fileType = match ? `image/${match[1]}` : `image`;

        data.append('image', {
            name: filename,
            type: fileType,
            uri: localUri
        });
    }

    const endPoint = "/profile/EditProfile";
    return client.post(endPoint, data);
};

const changePassword = (model) => {
    const endPoint = "/profile/changePassword";
    return client.post(endPoint, model);
}
export default {
    updateProfile,
    changePassword
}