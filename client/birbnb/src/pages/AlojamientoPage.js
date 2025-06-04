import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, Checkbox, Filtros } from '../components/Filtros';
import Skeleton from '../components/LoaderSkeleton';
import AlojamientoCard from '../components/AlojamientoCard';

const AlojamientoPage = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const buscar = async ({ ciudad, pais, precioMin, precioMax, huespedes, caracteristicas }) => {
    setCargando(true);
    const params = new URLSearchParams({
      limit: 10,
      page: 1,
      precioGte: precioMin,
      precioLte: precioMax,
      precioGt: precioMin - 1,
      precioLt: precioMax + 1,
      cantHuespedes: huespedes,
      caracteristicas: caracteristicas.join(','),
      ciudad,
      pais,
      lat: 36.1699,
      long: -115.1398
    });
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
    buscar({ ciudad: 'Las Vegas', pais: 'Estados Unidos', precioMin: 49, precioMax: 51, huespedes: 7, caracteristicas: ['WiFi', 'Vista al lago'] });
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Buscar alojamientos</h1>
      <Filtros onBuscar={buscar} />
      <div className="mt-6 grid gap-4">
        {cargando ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full max-w-md" />)
        ) : (
          alojamientos.map(a => <AlojamientoCard key={a.id} alojamiento={a} />)
        )}
      </div>
    </div>
  );
};

export default AlojamientoPage;
