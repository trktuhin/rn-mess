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

export default { getMembers, addMember, deleteMember };