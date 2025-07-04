import React, { useState } from 'react';
import { Button, Card, Tag } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import './AlojamientoCard.css';
import { Link } from 'react-router-dom';

const AlojamientoCard = ({ alojamiento, loading }) => {
  const [imagenError, setImagenError] = useState(false);

  const manejarErrorImagen = () => {
    setImagenError(true);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  return (
    <Card 
      className="alojamiento-card"
      loading={loading}
      hoverable
      cover={
        alojamiento.fotos && alojamiento.fotos.length > 0 && !imagenError ? (
          <img
            alt={`Vista del alojamiento ${alojamiento.nombre}`}
            src={alojamiento.fotos[0]}
            className="card-image"
            onError={manejarErrorImagen}
          />
        ) : (
          <div className="card-image-placeholder">
            <EnvironmentOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <p>Sin imagen disponible</p>
          </div>
        )
      }

    >
      <div className="card-content-wrapper">
        <Card.Meta
          title={
            <h3 className="card-title">
              {alojamiento.nombre}
            </h3>
          }
          description={
            <div className="card-content">

              <div className="precio-container">
                <span className="precio-principal">
                  <DollarOutlined /> {formatearPrecio(alojamiento.precioPorNoche)}
                </span>
                <span className="precio-texto">por noche</span>
              </div>


              <div className="info-basica">
                <div className="info-item">
                  <UserOutlined />
                  <span>Hasta {alojamiento.cantHuespedesMax} huéspedes</span>
                </div>
                
                <div className="info-item">
                  <EnvironmentOutlined />
                  <span>
                    {alojamiento.direccion?.ciudad?.nombre || 'Ciudad no disponible'}, {' '}
                    {alojamiento.direccion?.ciudad?.pais?.nombre || 'País no disponible'}
                  </span>
                </div>
              </div>


              {alojamiento.direccion && (
                <p className="direccion">
                  {alojamiento.direccion.calle} {alojamiento.direccion.altura}
                </p>
              )}


              <div className="caracteristicas-container">
                <div className="caracteristicas">
                  {alojamiento.caracteristicas && alojamiento.caracteristicas.length > 0 ? (
                    <>
                      {alojamiento.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                        <Tag 
                          key={index} 
                          color="blue"
                          className="caracteristica-tag"
                        >
                          {caracteristica}
                        </Tag>
                      ))}
                      {alojamiento.caracteristicas.length > 3 && (
                        <Tag color="default" className="caracteristica-tag">
                          +{alojamiento.caracteristicas.length - 3} más
                        </Tag>
                      )}
                    </>
                  ) : (
                    <Tag color="default" className="caracteristica-tag">
                      Sin características especificadas
                    </Tag>
                  )}
                                </div>
              </div>


              <div className="boton-reserva-container">
                <Link 
                  to="/alojamientoRecord" 
                  state={{ alojamiento }}
                  className="card-action-link"
                  aria-label={`Ver detalles y reservar ${alojamiento.nombre}`}
                >
                  <Button 
                    type="primary" 
                    icon={<CalendarOutlined />}
                    className="boton-reserva"
                    block
                  >
                    Ver detalles
                  </Button>
                </Link>
              </div>
            </div>
          }
        />
      </div>
    </Card>
  );
};

export default AlojamientoCard;
