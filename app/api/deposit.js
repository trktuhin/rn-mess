import client from './client';

const getMemberDropdown = () => {
    const endPoint = "/deposits/GetMemberDropdown";
    return client.get(endPoint);
}
const getDeposits = (sessionId = 0) => {
    const endPoint = `/deposits/GetDeposits?sessionId=${sessionId}`;
    return client.get(endPoint);
}
const addDeposit = (model) => {
    const endPoint = `/deposits/AddDeposit`;
    return client.post(endPoint, model);
}
const getDepositHistory = (memberId, sessionId = 0) => {
    const endPoint = `/deposits/GetDepositHistory/${memberId}?sessionId=${sessionId}`;
    return client.get(endPoint);
}
export default {
    getMemberDropdown,
    getDeposits,
    addDeposit,
    getDepositHistory
}