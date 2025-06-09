import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlojamientoPage from '../features/alojamientos/AlojamientoPage';
import HomePage from '../features/home/HomePage';
import ReservaPage from '../features/reservas/ReservaPage';
import NotificacionPage from '../features/notificaciones/NotificacionPage';
import Layout from '../features/layout/layout'
import AlojamientoRecordPage from '../features/alojamientos/AlojamientoRecordPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/busquedaAlojamientos" element={<AlojamientoPage />} />
        <Route path="/alojamientoRecord" element={<AlojamientoRecordPage />} />
        <Route path="/reservas" element={<ReservaPage />} />
        <Route path="/notificaciones" element={<NotificacionPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;