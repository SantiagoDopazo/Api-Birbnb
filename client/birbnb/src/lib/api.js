import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const getAlojamientos = (params) => {
  return axios.get(`${BASE_URL}/alojamientos`, { params });
};

export const crearUsuario = async (usuarioData) => {
  return axios.post(`${BASE_URL}/usuarios`, usuarioData);
};

export const loginUsuario = async (credenciales) => {
  return axios.post(`${BASE_URL}/login`, credenciales);
};

export const obtenerUsuarios = async () => {
  return axios.get(`${BASE_URL}/usuarios`);
};

