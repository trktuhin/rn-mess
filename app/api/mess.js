import client from './client';

const createMess = (model) => {
    const endPoint = "/mess/createMess";
    return client.post(endPoint, model);
}

export default { createMess }