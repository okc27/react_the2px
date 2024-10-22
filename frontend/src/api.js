// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost/headlesswp/the2px/wp-json/wp/v2/';

export const fetchSvgImages = async () => {
    const response = await axios.get(`${API_BASE_URL}svg-images`);
    return response.data;
};
