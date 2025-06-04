import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlojamientoPage from '../features/alojamientos/AlojamientoPage';
import Layout from '../features/layout/layout'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<AlojamientoPage />} /> */}
        <Route path="/busquedaAlojamientos" element={<AlojamientoPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;