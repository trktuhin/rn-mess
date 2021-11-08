import client from './client';
const login = (mobile, password) => {
    return client.post('/auth/login', { mobile, password });
}

export default {
    login
}