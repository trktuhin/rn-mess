import client from './client';
const login = (mobile, password) => {
    return client.post('/auth/login', { mobile, password });
}

const register = (model) => {
    const endpoint = "/auth/register";
    return client.post(endpoint, model);
}

const verifyOtp = (otpCode) => {
    const endpoint = `/auth/verifyOtp/${otpCode}`;
    return client.post(endpoint, {});
}

export default {
    login,
    register,
    verifyOtp
}