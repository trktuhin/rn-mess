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

const deleteMembership = (id) => {
    const endPoint = `/members/deleteMembership/${id}`;
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

const getMember = (memberId) => {
    const endPoint = `/members/${memberId}`;
    return client.get(endPoint);
}

const makeManager = (memberId) => {
    const endPoint = `/members/makeManager/${memberId}`;
    return client.get(endPoint);
}

const deleteManagership = (memberId) => {
    const endPoint = `/members/deleteManagership/${memberId}`;
    return client.get(endPoint);
}

const editMember = (model) => {
    const endPoint = "/members/EditMember";
    return client.post(endPoint, model);
}

export default {
    getMember,
    getMembers,
    addMember,
    deleteMember,
    sendRequest,
    getMemberRequests,
    deleteRequest,
    approveNewRequst,
    replaceMember,
    deleteMembership,
    makeManager,
    deleteManagership,
    editMember
};