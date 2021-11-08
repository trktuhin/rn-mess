import { create } from 'apisauce';
import authStorage from '../auth/storage';
import globalVariables from '../globalVariables';

const apiClient = create({
    baseURL: globalVariables.API_BASE
});

apiClient.addAsyncRequestTransform(async (request) => {
    const authToken = await authStorage.getToken();
    if (!authToken) return;
    const token = "Bearer " + authToken;
    request.headers["Authorization"] = token;
    // console.log("token", token);
});

export default apiClient;