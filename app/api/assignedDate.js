import client from './client';

const getAssignedDates = (sessionId = 0) => {
    const endPoint = `/AssignedDate/GetAllAssignedDates?sessionId=${sessionId}`;
    return client.get(endPoint);
}
const isDateAvailable = (model) => {
    const endPoint = `/AssignedDate/IsDateAvailable`;
    return client.post(endPoint, model);
}
const addMultipleDays = (model) => {
    const endPoint = `/AssignedDate/AssignMultipleDays`;
    return client.post(endPoint, model);
}
const addRangeDays = (model) => {
    const endPoint = `/AssignedDate/AssignRangedDays`;
    return client.post(endPoint, model);
}
const deleteAssingedDates = (model) => {
    const endPoint = `/AssignedDate/DeleteAssignedDate`;
    return client.post(endPoint, model);
}

export default {
    getAssignedDates,
    isDateAvailable,
    addMultipleDays,
    addRangeDays,
    deleteAssingedDates
}