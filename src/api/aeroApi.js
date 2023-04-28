import axios from 'axios';

const aeroApi = axios.create({
    baseURL: 'https://aerodatabox.p.rapidapi.com/flights/icao24/',
});

aeroApi.interceptors.request.use(function (config) {
    config.headers['X-RapidAPI-Key'] = process.env.REACT_APP_RAPID_API_KEY;
    config.headers['X-RapidAPI-Host'] = 'aerodatabox.p.rapidapi.com';

    return config;
});

export default aeroApi;
