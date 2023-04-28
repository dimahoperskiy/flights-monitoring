import axios from 'axios';

const aeroApi = axios.create({
    baseURL: 'https://aerodatabox.p.rapidapi.com/flights/icao24/',
});

aeroApi.interceptors.request.use(function (config) {
    config.headers['X-RapidAPI-Key'] =
        '240687566dmshedcebfd008a4864p1cb964jsn7b0e045004c2';
    config.headers['X-RapidAPI-Host'] = 'aerodatabox.p.rapidapi.com';

    return config;
});

export default aeroApi;
