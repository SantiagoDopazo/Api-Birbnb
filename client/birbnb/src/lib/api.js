import axios from 'axios';

const BASE_URL = 'https://two025-1c-lu-sa-grupo-06-1.onrender.com';

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

export const getUsuarioPorId = (id) => axios.get(`${BASE_URL}/usuarios/${id}`);

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


export const getReservasDeAnfitrion = (anfitrionId) =>
  axios.get(`${BASE_URL}/reservas/anfitrion/${anfitrionId}`);

export const confirmarReserva = async (reserva) => {
  return axios.put(`${BASE_URL}/reservas/${reserva.id}`, {
    fechaAlta: reserva.fechaAlta,
    huespedReservador: typeof reserva.huespedReservador === 'object' ? reserva.huespedReservador.id : reserva.huespedReservador,
    cantHuespedes: reserva.cantHuespedes,
    alojamiento: typeof reserva.alojamiento === 'object' ? reserva.alojamiento.id : reserva.alojamiento,
    rangoFechas: reserva.rangoFechas,
    precioPorNoche: reserva.precioPorNoche,
    estadoReserva: 'CONFIRMADA',
  });
};

export const rechazarReserva = async (reserva) => {
  return axios.put(`${BASE_URL}/reservas/${reserva.id}`, {
    fechaAlta: reserva.fechaAlta,
    huespedReservador: typeof reserva.huespedReservador === 'object' ? reserva.huespedReservador.id : reserva.huespedReservador,
    cantHuespedes: reserva.cantHuespedes,
    alojamiento: typeof reserva.alojamiento === 'object' ? reserva.alojamiento.id : reserva.alojamiento,
    rangoFechas: reserva.rangoFechas,
    precioPorNoche: reserva.precioPorNoche,
    motivoCancelacion: reserva.motivoCancelacion,
    estadoReserva: 'CANCELADA',
  });
};

