import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlojamientoPage from '../pages/AlojamientoPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AlojamientoPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;