import React from 'react';
import { Card, Row, Col, Tag, Typography, Divider } from 'antd';
import './ReservaPage.css';

const { Title, Paragraph, Text } = Typography;


const reservas = [
  {
    id: '1',
    alojamiento: {
      nombre: 'Anor Londo Palace',
      direccion: 'Avenida de los Dioses 100, Anor Londo, Reino de la Luz',
      imagen: '/images/imagen10.jpg',
    },
    rangoFechas: { desde: '2025-10-20', hasta: '2025-10-30' },
    cantHuespedes: 2,
    precioPorNoche: 500,
    estadoReserva: 'CONFIRMADA',
  },
  {
    id: '2',
    alojamiento: {
      nombre: 'Casa del Lago',
      direccion: 'Lago Azul 123, Villa Lago, Argentina',
      imagen: '/images/imagen2.png',
    },
    rangoFechas: { desde: '2025-11-01', hasta: '2025-11-05' },
    cantHuespedes: 4,
    precioPorNoche: 300,
    estadoReserva: 'PENDIENTE',
  },
];

const estadoColor = {
  CONFIRMADA: 'green',
  PENDIENTE: 'orange',
  CANCELADA: 'red',
};

const ReservaPage = () => (
  <div className="reserva-page-container">
    <Title level={2}>Mis Reservas</Title>
    <Divider />
    <Row gutter={[24, 24]}>
      {reservas.map((reserva) => (
        <Col xs={24} md={12} key={reserva.id}>
          <Card
            hoverable
            cover={
              <img
                alt={reserva.alojamiento.nombre}
                src={reserva.alojamiento.imagen}
                className="reserva-card-img"
              />
            }
          >
            <Title level={4}>{reserva.alojamiento.nombre}</Title>
            <Paragraph type="secondary">{reserva.alojamiento.direccion}</Paragraph>
            <Paragraph>
              <Text strong>Fechas:</Text> {reserva.rangoFechas.desde} a {reserva.rangoFechas.hasta}
            </Paragraph>
            <Paragraph>
              <Text strong>Huéspedes:</Text> {reserva.cantHuespedes}
            </Paragraph>
            <Paragraph>
              <Text strong>Precio por noche:</Text> ${reserva.precioPorNoche}
            </Paragraph>
            <Tag color={estadoColor[reserva.estadoReserva]}>{reserva.estadoReserva}</Tag>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default ReservaPage;