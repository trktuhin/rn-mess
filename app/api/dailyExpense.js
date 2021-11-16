import client from './client';

const getDailyExpenses = (sessionId = 0) => {
    const endPoint = `/expense/GetDailyExpenses?sessionId=${sessionId}`;
    return client.get(endPoint);
}
const addDailyExpense = (model) => {
    const endPoint = `/expense/AddDailyExpense`;
    return client.post(endPoint, model);
}

const getSignleExpense = (id) => {
    const endPoint = `/expense/GetDailyExpenseDetails/${id}`;
    return client.get(endPoint);
}
const editDailyExpense = (model) => {
    const endPoint = `/expense/EditDailyExpense`;
    return client.post(endPoint, model);
}
const deleteDailyExpense = (id) => {
    const endPoint = `/expense/DeleteDailyExpense/${id}`;
    return client.delete(endPoint);
}

export default {
    getDailyExpenses,
    addDailyExpense,
    getSignleExpense,
    editDailyExpense,
    deleteDailyExpense
};