import client from './client';

const addSession = (model) => {
    const endPoint = "/profile/AddSession";
    return client.post(endPoint, model);
}

const updateSession = (model) => {
    const endPoint = "/profile/UpdateSession";
    return client.put(endPoint, model);
}

const getSessions = () => {
    const endPoint = "/profile/GetSessions";
    return client.get(endPoint);
}
const getSession = (id) => {
    const endPoint = `/profile/GetSessions/${id}`;
    return client.get(endPoint);
}
const deleteSession = (id) => {
    const endPoint = `/profile/DeleteSession/${id}`;
    return client.delete(endPoint);
}

export default {
    addSession,
    updateSession,
    getSessions,
    getSession,
    deleteSession
}