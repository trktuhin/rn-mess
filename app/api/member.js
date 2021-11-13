import client from './client';

const getMembers = () => {
    const endPoint = "/members";
    return client.get(endPoint);
}

const addMember = (model) => {
    const endPoint = "/members/addMember";
    return client.post(endPoint, model);
}

const deleteMember = (id) => {
    const endPoint = `/members/${id}`;
    return client.delete(endPoint);
}

const sendRequest = (model) => {
    const endPoint = '/members/addRequest';
    return client.post(endPoint, model);
}

const getMemberRequests = () => {
    const endPoint = "/members/getRequests";
    return client.get(endPoint);
}

const deleteRequest = (userId) => {
    const endPoint = `/members/deleteRequest/${userId}`;
    return client.post(endPoint, {});
}

const approveNewRequst = (userId) => {
    const endPoint = `/members/approveRequest/${userId}`;
    return client.post(endPoint, {});
}

const replaceMember = (model) => {
    const endPoint = '/members/replaceMember';
    return client.post(endPoint, model);
}

export default {
    getMembers,
    addMember,
    deleteMember,
    sendRequest,
    getMemberRequests,
    deleteRequest,
    approveNewRequst,
    replaceMember
};