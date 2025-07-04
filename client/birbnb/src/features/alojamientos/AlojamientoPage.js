import './AlojamientoPage.css';
import React, { useEffect, useState } from 'react';
import { getAlojamientos } from '../../lib/api';
import { Input, Checkbox, Filtros } from '../../components/filtros/Filtros';
import Skeleton from '../../components/LoaderSkeleton';
import AlojamientoCard from '../../components/alojamientoCard/AlojamientoCard';
import { LoadingOutlined, FilterOutlined, HomeOutlined } from '@ant-design/icons';
import { Flex, Spin, message, Empty, Button } from 'antd';

const AlojamientoPage = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState({});
  const [error, setError] = useState(null);
  const [primeraCarga, setPrimeraCarga] = useState(true);

  const buscar = async (filtros = {}) => {
    setCargando(true);
    setError(null);
    
    const params = new URLSearchParams({ limit: 20, page: 1 });


    if (filtros.precioMin !== undefined && filtros.precioMin > 0) {
      params.set('precioGte', filtros.precioMin);
      params.set('precioGt', filtros.precioMin - 1);
    }

    if (filtros.precioMax !== undefined && filtros.precioMax < 200) {
      params.set('precioLte', filtros.precioMax);
      params.set('precioLt', filtros.precioMax + 1);
    }

    if (filtros.huespedes) params.set('cantHuespedes', filtros.huespedes);
    if (filtros.caracteristicas && filtros.caracteristicas.length) {
      params.set('caracteristicas', filtros.caracteristicas.join(','));
    }
    if (filtros.ciudad && filtros.ciudad.trim()) params.set('ciudad', filtros.ciudad.trim());
    if (filtros.pais && filtros.pais.trim()) params.set('pais', filtros.pais.trim());

    if (filtros.rangoFechas && filtros.rangoFechas.length === 2) {
      params.set('fechaDesde', filtros.rangoFechas[0]);
      params.set('fechaHasta', filtros.rangoFechas[1]);
    }

    setFiltrosAplicados(filtros);

    try {
      const res = await getAlojamientos(params);
      setAlojamientos(res.data.data || []);
      

      if (!primeraCarga && res.data.data && res.data.data.length > 0) {
        message.success(`Se encontraron ${res.data.data.length} alojamientos`);
      }
      

      if (res.data.data && res.data.data.length === 0 && Object.keys(filtros).some(key => filtros[key])) {
        message.info('No se encontraron alojamientos con los filtros aplicados. Intenta ajustar tu búsqueda.');
      }
      
    } catch (err) {
      console.error('Error al buscar alojamientos:', err);
      setError('Error al cargar los alojamientos. Por favor, intenta nuevamente.');
      message.error('Error al cargar los alojamientos');
      setAlojamientos([]);
    } finally {
      setCargando(false);
      if (primeraCarga) setPrimeraCarga(false);
    }
  };

  const toggleFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  useEffect(() => {
    buscar({});
  }, []);

  const tieneFiltrosAplicados = Object.keys(filtrosAplicados).some(key => {
    const valor = filtrosAplicados[key];
    return valor && (Array.isArray(valor) ? valor.length > 0 : valor.toString().trim() !== '');
  });

  return (
    <div className='contenedor-principal'>
      <h1 className='texto'>
        Descubre tu próximo destino
      </h1>

      <button
        className="botonFiltros"
        onClick={toggleFiltros}
        aria-expanded={mostrarFiltros}
        aria-controls="filtros-contenedor"
        aria-label={mostrarFiltros ? "Ocultar filtros de búsqueda" : "Mostrar filtros de búsqueda"}
      >
        <span className="icono" aria-hidden="true">
          <FilterOutlined />
        </span>
        <span className="boton-texto">
          Filtros {tieneFiltrosAplicados && '(aplicados)'}
        </span>
        <span className="flecha" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ transform: mostrarFiltros ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M1.5 5.5l6 6 6-6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </span>
      </button>

      <div id="filtros-contenedor" role="region" aria-label="Filtros de búsqueda">
        {mostrarFiltros && <Filtros onBuscar={buscar} alojamientos={alojamientos} />}
      </div>

      {cargando && (
        <div className="spinner-container" role="status" aria-live="polite">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            tip="Buscando alojamientos..."
          />
        </div>
      )}

      {error && !cargando && (
        <div className="estado-vacio" role="alert">
          <h3>Oops! Algo salió mal</h3>
          <p>{error}</p>
          <Button 
            type="primary" 
            onClick={() => buscar(filtrosAplicados)}
            style={{ marginTop: '1rem' }}
          >
            Intentar nuevamente
          </Button>
        </div>
      )}


      {!cargando && !error && (
        <>
          {alojamientos.length > 0 ? (
            <>
              <div style={{ margin: '1rem 0', textAlign: 'center', color: '#666' }}>
                <p>
                  {alojamientos.length} alojamiento{alojamientos.length !== 1 ? 's' : ''} encontrado{alojamientos.length !== 1 ? 's' : ''}
                  {tieneFiltrosAplicados && ' con los filtros aplicados'}
                </p>
              </div>
              <div className="grid-alojamientos" role="main" aria-label="Lista de alojamientos">
                {alojamientos.map((alojamiento, index) => (
                  <AlojamientoCard 
                    key={alojamiento.id} 
                    alojamiento={alojamiento}
                    aria-label={`Alojamiento ${index + 1} de ${alojamientos.length}: ${alojamiento.nombre}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="estado-vacio">
              <Empty
                image={<HomeOutlined style={{ fontSize: 64, color: '#ccc' }} />}
                description={
                  <div>
                    <h3>No se encontraron alojamientos</h3>
                    <p>
                      {tieneFiltrosAplicados 
                        ? 'Intenta ajustar los filtros de búsqueda o explorar diferentes opciones.'
                        : 'Parece que no hay alojamientos disponibles en este momento.'
                      }
                    </p>
                  </div>
                }
              >
                {tieneFiltrosAplicados && (
                  <Button 
                    type="primary" 
                    onClick={() => {
                      setFiltrosAplicados({});
                      buscar({});
                    }}
                  >
                    Ver todos los alojamientos
                  </Button>
                )}
              </Empty>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlojamientoPage;