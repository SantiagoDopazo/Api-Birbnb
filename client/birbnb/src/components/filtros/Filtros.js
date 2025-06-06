import React, { useState } from 'react';
import './Filtros.css';
import { Slider } from 'antd';

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
export const Filtros = ({ onBuscar }) => {
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

  const manejarBusqueda = () => {
    const seleccionadas = Object.keys(caracteristicas).filter(k => caracteristicas[k]);
    onBuscar({ ciudad, pais, precioMin, precioMax, huespedes, caracteristicas: seleccionadas });
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
            min={0}
            max={200}
            step={1}
            value={[precioMin || 0, precioMax || 200]}
            onChange={([min, max]) => {
              setPrecioMin(min);
              setPrecioMax(max);
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
        <Button onClick={manejarBusqueda}>Buscar</Button>
    </>
  );
};

export default Filtros;
