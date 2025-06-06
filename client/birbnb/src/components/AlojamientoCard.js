import React, { useState } from 'react';
import { Card, Flex } from 'antd';


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
            </>
          }
        />
      </Card>
    </Flex>
  );
};
export default AlojamientoCard;
