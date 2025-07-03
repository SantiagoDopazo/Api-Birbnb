import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// ===== ALOJAMIENTOS =====
export const getAlojamientos = (params) => {
  return axios.get(`${BASE_URL}/alojamientos`, { params });
};

export const getAlojamientoPorId = async (alojamientoId) => {
  return axios.get(`${BASE_URL}/alojamientos/${alojamientoId}`);
};

// ===== USUARIOS =====
export const crearUsuario = async (usuarioData) => {
  return axios.post(`${BASE_URL}/usuarios`, usuarioData);
};

export const loginUsuario = async (credenciales) => {
  return axios.post(`${BASE_URL}/login`, credenciales);
};

export const obtenerUsuarios = async () => {
  return axios.get(`${BASE_URL}/usuarios`);
};

// ===== RESERVAS =====
export const crearReserva = async (reservaData) => {
  return axios.post(`${BASE_URL}/reservas`, reservaData);
};

export const getReservasPorUsuario = async (usuarioId) => {
  return axios.get(`${BASE_URL}/reservas/usuario/${usuarioId}`);
};

export const actualizarReserva = async (reservaId, reservaData) => {
  return axios.put(`${BASE_URL}/reservas/${reservaId}`, reservaData);
};

export const eliminarReserva = async (reservaId) => {
  return axios.delete(`${BASE_URL}/reservas/${reservaId}`);
};

// Función para cancelar reserva (usando update para cambiar estado)
export const cancelarReserva = async (reservaId) => {
  return axios.put(`${BASE_URL}/reservas/${reservaId}`, {
    estadoReserva: 'CANCELADA'
  });
};

// ===== NOTIFICACIONES =====
export const getNotificacionesPorUsuario = async (usuarioId, leida = undefined) => {
  const params = new URLSearchParams({ usuarioId });

  if (leida !== undefined) {
    params.append('leida', leida);
  }

  return axios.get(`${BASE_URL}/notificaciones?${params.toString()}`);
};

export const marcarNotificacionComoLeida = (id) => {
  return axios.patch(`${BASE_URL}/notificaciones/${id}`, {
    leida: true
  });
};