import axios from 'axios';

const baseApi = axios.create({
    baseURL: 'https://opensky-network.org/api/',
});

baseApi.interceptors.request.use(function (config) {
    const credentials = process.env.REACT_APP_OPENSKY_CREDENTIALS;
    config.headers.Authorization = 'Basic ' + credentials;

    return config;
});

export default baseApi;
