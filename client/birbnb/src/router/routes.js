import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlojamientoPage from '../features/alojamientos/AlojamientoPage';
import HomePage from '../features/home/HomePage';
import ReservaPage from '../features/reservas/ReservaPage';
import NotificacionPage from '../features/notificaciones/NotificacionPage';
import Layout from '../features/layout/layout'
import AlojamientoRecordPage from '../features/alojamientos/AlojamientoRecordPage';
import LoginPage from '../features/accesoUsuario/LoginPage';
import RegisterPage from '../features/accesoUsuario/RegisterPage';
import ScrollToTop from '../components/scrollTop';
import TestMessage from '../features/test';

const AppRoutes = () => (
  <Router>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/busquedaAlojamientos" element={<AlojamientoPage />} />
        <Route path="/alojamientoRecord" element={<AlojamientoRecordPage />} />
        <Route path="/reservas" element={<ReservaPage />} />
        <Route path="/notificaciones" element={<NotificacionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/test" element={<TestMessage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;