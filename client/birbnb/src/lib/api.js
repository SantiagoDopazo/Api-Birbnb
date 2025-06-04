import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const getAlojamientos = (params) => {
  return axios.get(`${BASE_URL}/alojamientos`, { params });
};