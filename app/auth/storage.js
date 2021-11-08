import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const tokeyKey = "authToken";
const userKey = "userData";

const storeToken = async authToken => {
    try {
        await SecureStore.setItemAsync(tokeyKey, authToken);
    } catch (error) {
        console.log('Error storing the auth Token', error);
    }
}

const storeUser = async userData => {
    try {
        await SecureStore.setItemAsync(userKey, JSON.stringify(userData));
    } catch (error) {
        console.log('Error storing the auth Token', error);
    }
}

const getUser = async () => {
    const token = await getToken();
    if (token) {
        const decodedJwt = jwtDecode(token);
        if (decodedJwt.exp * 1000 < Date.now()) {
            return null;
        }
    }
    const user = await SecureStore.getItemAsync(userKey);
    return (user) ? JSON.parse(user) : null;
}


const getToken = async () => {
    try {
        const authToken = await SecureStore.getItemAsync(tokeyKey);
        return authToken;
    } catch (error) {
        console.log('Error getting the auth Token', error);
    }
}

const getDecodedToken = async () => {
    const token = await getToken()
    return jwtDecode(token);
}

const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync(tokeyKey);
    } catch (error) {
        console.log('Error removing the auth Token', error);
    }
}

const removeUser = async () => {
    try {
        await SecureStore.deleteItemAsync(userKey);
    } catch (error) {
        console.log('Error removing user data', error);
    }
}

export default { getUser, getToken, storeToken, removeToken, removeUser, storeUser, getDecodedToken };