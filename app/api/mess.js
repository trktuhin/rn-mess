import client from './client';

const createMess = (model) => {
    const endPoint = "/mess/createMess";
    return client.post(endPoint, model);
}

const getMess = () => {
    const endPoint = "/mess";
    return client.get(endPoint);
}

const updateMess = (model) => {
    const endPoint = "/mess/updatemess";
    return client.put(endPoint, model);
}

const deleteMess = () => {
    const endPoint = "/mess/deleteMess";
    return client.post(endPoint, {});
}

export default { createMess, getMess, updateMess, deleteMess }