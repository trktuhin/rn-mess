import client from './client';

const getFixedExpenses = (sessionId = 0) => {
    const endPoint = `/expense/GetFixedExpenses?sessionId=${sessionId}`;
    return client.get(endPoint);
}
const addFixedExpense = (model) => {
    const endPoint = `/expense/AddFixedExpense`;
    return client.post(endPoint, model);
}
const updateFixedExpense = (model) => {
    const endPoint = `/expense/UpdateFixedExpense`;
    return client.put(endPoint, model);
}
const getFixedExpense = (id) => {
    const endPoint = `/expense/GetFixedExpense/${id}`;
    return client.get(endPoint);
}
const deleteFixedExpense = (id) => {
    const endPoint = `/expense/DeleteFixedExpense/${id}`;
    return client.delete(endPoint);
}
const getOtherMealRate = (sessionId = 0) => {
    const endPoint = `/expense/GetMealRatesWithPerHeads?sessionId=${sessionId}`;
    return client.get(endPoint);
}

export default {
    getFixedExpenses,
    addFixedExpense,
    updateFixedExpense,
    getFixedExpense,
    deleteFixedExpense,
    getOtherMealRate
}