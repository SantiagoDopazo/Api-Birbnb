import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Typography, Divider, message, Spin } from 'antd';
import { getReservasPorUsuario } from '../../lib/api'; 
import { getAlojamientoPorId } from '../../lib/api';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const estadoColor = {
  CONFIRMADA: 'green',
  PENDIENTE: 'orange',
  CANCELADA: 'red',
};

const ReservaPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      message.error('Debes estar logueado para ver tus reservas');
      setLoading(false);
      return;
    }

    getReservasPorUsuario(usuario.id)
      .then(async (res) => {
        const reservasData = res.data;

        const reservasConAlojamiento = await Promise.all(
          reservasData.map(async (reserva) => {
            const resAloj = await getAlojamientoPorId(reserva.alojamiento);
            return {
              ...reserva,
              alojamiento: resAloj.data,
            };
          })
        );

        setReservas(reservasConAlojamiento);
      })
      .catch((error) => {
        console.error(error);
        message.error('Error al cargar tus reservas');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '2rem'}}>
        <Spin size="large" />
      </div>
    );
  }

  if (!reservas.length) {
    return (
      <div style={{textAlign: 'center', padding: '2rem'}}>
        <Title level={3}>No tenés reservas aún</Title>
      </div>
    );
  }

  return (
    <div className="reserva-page-container" style={{ padding: '2rem' }}>
      <Title level={2}>Mis Reservas</Title>
      <Divider />
      <Row gutter={[24, 24]}>
        {reservas.map((reserva) => {
        const alojamiento = reserva.alojamiento || {};
        const fotos = Array.isArray(alojamiento.fotos) ? alojamiento.fotos : [];
        const foto = fotos.length > 0 ? fotos[0] : '/images/default-alojamiento.jpg';
        const nombreAlojamiento = alojamiento.nombre || 'Nombre no disponible';

        return (
          <Col xs={24} md={12} key={reserva.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={nombreAlojamiento}
                  src={foto}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Title level={4}>{nombreAlojamiento}</Title>
              <Paragraph type="secondary">
                {alojamiento.direccion?.ciudad?.nombre || ''}, {alojamiento.direccion?.ciudad?.pais?.nombre || ''}
              </Paragraph>
              <Paragraph>
                <Text strong>Fechas:</Text> {dayjs(reserva.rangoFechas?.desde).format('DD/MM/YYYY')} a {dayjs(reserva.rangoFechas?.hasta).format('DD/MM/YYYY')}
              </Paragraph>
              <Paragraph>
                <Text strong>Huéspedes:</Text> {reserva.cantHuespedes}
              </Paragraph>
              <Paragraph>
                <Text strong>Precio por noche:</Text> ${reserva.precioPorNoche}
              </Paragraph>
              <Tag color={estadoColor[reserva.estadoReserva] || 'default'}>
                {reserva.estadoReserva || 'SIN ESTADO'}
              </Tag>
            </Card>
          </Col>
        );
      })}
      </Row>
    </div>
  );
};

export default ReservaPage;