import { useContext } from "react";
import AuthContext from "./context";
import authStorage from './storage';
import jwtDecode from "jwt-decode";

export default useAuth = () => {
    const { user, setUser, token } = useContext(AuthContext);

    const decodedToken = async () => {
        const token = await authStorage.getToken();
        if (token) {
            return jwtDecode(token);//isMobileVerified="verified",messRole="",nameid="user-id",MessId="0",messName=""
        }
    }

    const login = (loginData) => {
        setUser(loginData.user);
        authStorage.storeUser(loginData.user);
        authStorage.storeToken(loginData.token);
    }
    const logout = () => {
        setUser(null);
        authStorage.removeUser();
        authStorage.removeToken();
    }

    const updateUser = (userData) => {
        setUser(userData);
        authStorage.storeUser(userData);
    }

    const updateToken = (token) => {
        authStorage.storeToken(token);
    }

    return { user, login, logout, updateUser, decodedToken, updateToken, token };
}