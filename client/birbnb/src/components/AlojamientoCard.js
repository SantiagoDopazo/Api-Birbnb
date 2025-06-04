import React from 'react';

const AlojamientoCard = ({ alojamiento }) => (
  <div className="border rounded-2xl p-4 shadow-md w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2">{alojamiento.nombre}</h2>
    <p className="text-sm text-gray-600 mb-1">${alojamiento.precioPorNoche} por noche</p>
    <p className="text-sm text-gray-600 mb-1">Hasta {alojamiento.cantHuespedesMax} huéspedes</p>
    <p className="text-sm text-gray-600 mb-1">
      {alojamiento.direccion.calle} {alojamiento.direccion.altura}, {alojamiento.direccion.ciudad.nombre}, {alojamiento.direccion.ciudad.pais.nombre}</p>
    <div className="mt-2">
      {alojamiento.caracteristicas.map((c, i) => (
        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-1">{c}</span>
      ))}
    </div>
  </div>
);


export default AlojamientoCard;
