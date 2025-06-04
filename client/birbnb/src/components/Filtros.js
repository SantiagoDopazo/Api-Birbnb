import React, { useState } from 'react';

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
  const [ciudad, setCiudad] = useState('Las Vegas');
  const [pais, setPais] = useState('Estados Unidos');
  const [precioMin, setPrecioMin] = useState(49);
  const [precioMax, setPrecioMax] = useState(51);
  const [huespedes, setHuespedes] = useState(7);
  const [caracteristicas, setCaracteristicas] = useState({ WiFi: true, 'Vista al lago': true });

  const manejarBusqueda = () => {
    const seleccionadas = Object.keys(caracteristicas).filter(k => caracteristicas[k]);
    onBuscar({ ciudad, pais, precioMin, precioMax, huespedes, caracteristicas: seleccionadas });
  };

  return (
    <div className="p-4 grid gap-4 bg-white rounded-2xl shadow w-full max-w-4xl mx-auto">
      <Input label="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} />
      <Input label="País" value={pais} onChange={e => setPais(e.target.value)} />
      <Input label="Precio mínimo" type="number" value={precioMin} onChange={e => setPrecioMin(Number(e.target.value))} />
      <Input label="Precio máximo" type="number" value={precioMax} onChange={e => setPrecioMax(Number(e.target.value))} />
      <Input label="Huéspedes" type="number" value={huespedes} onChange={e => setHuespedes(Number(e.target.value))} />
      <div className="flex flex-col space-y-2">
        {Object.keys(caracteristicas).map((key) => (
          <Checkbox
            key={key}
            label={key}
            checked={caracteristicas[key]}
            onChange={() => setCaracteristicas(prev => ({ ...prev, [key]: !prev[key] }))}
          />
        ))}
      </div>
      <Button onClick={manejarBusqueda}>Buscar</Button>
    </div>
  );
};

export default Filtros;
