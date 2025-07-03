import React, { useState } from 'react';
import './Filtros.css';
import { DatePicker, Slider } from 'antd';
import dayjs from 'dayjs';

// Componentes reutilizables
export const Input = ({ label, ...props }) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    <input className="input" {...props} />
  </div>
);

export const Button = ({ children, ...props }) => (
  <button className="button" {...props}>
    {children}
  </button>
);

export const Checkbox = ({ label, ...props }) => (
  <label className="checkbox">
    <input type="checkbox" {...props} />
    {label}
  </label>
);

// Componente principal Filtros
export const Filtros = ({ onBuscar, alojamientos }) => {
  const { RangePicker } = DatePicker;

  const [rangoFechas, setRangoFechas] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [precioMin, setPrecioMin] = useState();
  const [precioMax, setPrecioMax] = useState();
  const [huespedes, setHuespedes] = useState();
  const [caracteristicas, setCaracteristicas] = useState({ 
    'WiFi': false, 
    'Vista al lago': false, 
    'Parrilla': false,
    'Piscina': false,
    'Mascotas permitidas': false,
    'Estacionamiento': false
  });
  
  const precios = alojamientos.map(a => a.precioPorNoche);
  const precioMinimo = precios.length ? Math.min(...precios) : 0;
  const precioMaximo = precios.length ? Math.max(...precios) : 200;

  const manejarBusqueda = () => {
    const seleccionadas = Object.keys(caracteristicas).filter(k => caracteristicas[k]);

    let fechasSeleccionadas;
    if (rangoFechas && rangoFechas.length === 2) {
      fechasSeleccionadas = [
        rangoFechas[0].format('YYYY-MM-DD'),
        rangoFechas[1].format('YYYY-MM-DD')
      ];
    }

    onBuscar({ ciudad, pais, precioMin, precioMax, huespedes, caracteristicas: seleccionadas, rangoFechas: fechasSeleccionadas });
  };

  const eliminarFiltros = () => {
    setCiudad('');
    setPais('');
    setPrecioMin();
    setPrecioMax();
    setHuespedes('');
    setCaracteristicas({
    'WiFi': false, 
    'Vista al lago': false, 
    'Parrilla': false,
    'Piscina': false,
    'Mascotas permitidas': false,
    'Estacionamiento': false
    });
    setRangoFechas([]);
  };


  return (
    <>
      <div className="filtros">
        <Input label="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} />
        <Input label="País" value={pais} onChange={e => setPais(e.target.value)} />
        <div className="form-group">
          <label>Rango de precios</label>
          <Slider
            range
            min={precioMinimo}
            max={precioMaximo}
            step={1}
            value={[
              precioMin !== undefined ? precioMin : precioMinimo,
              precioMax !== undefined ? precioMax : precioMaximo
            ]}
            onChange={([min, max]) => {
              setPrecioMin(min);
              setPrecioMax(max);
            }}
          />
        </div>
        <div className="form-group">
          <label>Disponibilidad (rango de fechas)</label>
          <RangePicker
            value={rangoFechas}
            onChange={(dates) => setRangoFechas(dates)}
            format="DD/MM/YYYY"
            placeholder={['Fecha desde', 'Fecha hasta']}
            disabledDate={(current) => {
              return current && current < dayjs().startOf('day');
            }}
          />
        </div>
        <Input label="Huéspedes" type="number" value={huespedes} onChange={e => setHuespedes(Number(e.target.value))} />
        <div className="caracteristicas">
          {Object.keys(caracteristicas).map((key) => (
            <Checkbox
              key={key}
              label={key}
              checked={caracteristicas[key]}
              onChange={() => setCaracteristicas(prev => ({ ...prev, [key]: !prev[key] }))}
            />
          ))}
        </div>
      </div>
      <div className="botonesFilters">
        <Button onClick={manejarBusqueda}>Buscar</Button>
        <Button onClick={eliminarFiltros}>Eliminar filtros</Button>
      </div>
    </>
  );
};

export default Filtros;