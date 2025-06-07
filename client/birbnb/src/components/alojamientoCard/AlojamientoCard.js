import React, { useState } from 'react';
import { Button, Card, Flex } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import './AlojamientoCard.css';
import { Link } from 'react-router-dom';


const AlojamientoCard = ({ alojamiento, loading }) => {
  return (
    <Flex gap="middle" align="start" vertical>
      <Card style={{ minWidth: 300 }}>
        <Card.Meta
          title={alojamiento.nombre}
          description={
            <>
              <p>${alojamiento.precioPorNoche} por noche</p>
              <p>Hasta {alojamiento.cantHuespedesMax} huéspedes</p>
              <p>
                {alojamiento.direccion.calle} {alojamiento.direccion.altura}, {alojamiento.direccion.ciudad.nombre}, {alojamiento.direccion.ciudad.pais.nombre}</p>
              <div>
                {alojamiento.caracteristicas.map((c, i) => (
                  <span key={i}>{c} </span>
                ))}
              </div>
              <Flex gap="middle" wrap className="boton-reserva">
                <Link to="/alojamientoRecord" state={{ alojamiento }}>
                  <Button type="primary">Reserva ahora! <CalendarOutlined /></Button>
                </Link>
              </Flex>
            </>
          }
        />
      </Card>
    </Flex>
  );
};
export default AlojamientoCard;
