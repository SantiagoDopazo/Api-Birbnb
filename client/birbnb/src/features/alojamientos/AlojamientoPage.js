import './AlojamientoPage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, Checkbox, Filtros } from '../../components/filtros/Filtros';
import Skeleton from '../../components/LoaderSkeleton';
import AlojamientoCard from '../../components/AlojamientoCard';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';


const AlojamientoPage = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const buscar = async ({ ciudad, pais, precioMin, precioMax, huespedes, caracteristicas } = {}) => {
  setCargando(true);
  const params = new URLSearchParams({ limit: 20, page: 1 });

  if (precioMin !== undefined) {
    params.set('precioGte', precioMin);
    params.set('precioGt', precioMin - 1);
  }

  if (precioMax !== undefined) {
    params.set('precioLte', precioMax);
    params.set('precioLt', precioMax + 1);
  }

  if (huespedes) params.set('cantHuespedes', huespedes);
  if (caracteristicas && caracteristicas.length) {
    params.set('caracteristicas', caracteristicas.join(','));
  }
  if (ciudad) params.set('ciudad', ciudad);
  if (pais) params.set('pais', pais);

  try {
    const res = await axios.get(`http://localhost:3000/alojamientos?${params.toString()}`);
    setAlojamientos(res.data.data);
  } catch (err) {
    console.error(err);
  } finally {
    setCargando(false);
  }
};


useEffect(() => {
  buscar({});
}, []);

  return (
    <div className='contenedor-principal'>
      <h1 className='texto'>
        Buscar alojamientos
      </h1>

      <button
        className="botonFiltros"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
      <span className="icono">
        {/* Ícono sliders */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11 3a1 1 0 1 1 2 0h1.5a.5.5 0 0 1 0 1H13a1 1 0 0 1-2 0H1.5a.5.5 0 0 1 0-1H11zM5 7a1 1 0 1 1 2 0h7.5a.5.5 0 0 1 0 1H7a1 1 0 0 1-2 0H1.5a.5.5 0 0 1 0-1H5zm6 4a1 1 0 1 1 2 0h1.5a.5.5 0 0 1 0 1H13a1 1 0 0 1-2 0H1.5a.5.5 0 0 1 0-1H11z" />
        </svg>
      </span>
      <span className="texto">Filters</span>
      <span className="flecha">
        {/* Flecha abajo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1.5 5.5l6 6 6-6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </span>
     </button>


      {mostrarFiltros && <Filtros onBuscar={buscar} />}

        {cargando ? (
          <div className="spinner-container">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          </div>
        ) : (
          <div className="grid-alojamientos">
            {alojamientos.map((a) => (
              <AlojamientoCard key={a.id} alojamiento={a} />
            ))}
          </div>
        )}
    </div>
  );
}

export default AlojamientoPage;