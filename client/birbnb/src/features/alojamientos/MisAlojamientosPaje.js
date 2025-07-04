import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, message, Typography, Tag } from 'antd';
import {
  getReservasDeAnfitrion,
  getAlojamientoPorId,
  getUsuarioPorId,
  confirmarReserva
} from '../../lib/api';
import { CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const MisAlojamientosPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioId = JSON.parse(localStorage.getItem('usuario'))?.id;

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const res = await getReservasDeAnfitrion(usuarioId);
      const reservasData = res.data;

      const reservasConInfo = await Promise.all(
        reservasData.map(async (reserva) => {
          let alojamiento = {};
          try {
            const resAloj = await getAlojamientoPorId(reserva.alojamiento);
            alojamiento = resAloj.data || {};
          } catch (error) {
            console.error(`Error al cargar alojamiento ${reserva.alojamiento}:`, error);
            alojamiento = { nombre: 'Alojamiento no disponible' };
          }

          let nombreHuesped = 'Huésped';
          try {
            const resUsuario = await getUsuarioPorId(reserva.huespedReservador);
            nombreHuesped = resUsuario.data?.nombre || 'Huésped';
          } catch (error) {
            console.error(`Error al cargar usuario ${reserva.huespedReservador}:`, error);
          }

          return {
            ...reserva,
            alojamiento,
            nombreHuesped
          };
        })
      );

      reservasConInfo.sort((a, b) => {
        if (a.estadoReserva === 'PENDIENTE' && b.estadoReserva !== 'PENDIENTE') return -1;
        if (a.estadoReserva !== 'PENDIENTE' && b.estadoReserva === 'PENDIENTE') return 1;
        return 0;
      });

      setReservas(reservasConInfo);
    } catch (err) {
      console.error(err);
      message.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioId) fetchReservas();
  }, [usuarioId]);

  const handleConfirmar = async (reserva) => {
    try {
      await confirmarReserva(reserva);
      message.success('Reserva confirmada');
      fetchReservas();
    } catch (err) {
      console.error(err);
      message.error('Error al confirmar la reserva');
    }
  };

  const getTagColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'green';
      case 'CANCELADA':
        return 'red';
      default:
        return 'orange';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>Mis Alojamientos - Reservas</Title>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No tienes reservas pendientes en tus alojamientos.</p>
      ) : (
        <Row gutter={[24, 24]}>
          {reservas.map((reserva) => (
            <Col xs={24} md={12} lg={8} key={reserva.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={reserva.alojamiento?.nombre || 'Alojamiento'}
                    src={
                      reserva.alojamiento?.fotos?.[0] ||
                      'https://via.placeholder.com/400x200?text=Sin+imagen'
                    }
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <Title level={4}>{reserva.alojamiento?.nombre || 'Alojamiento'}</Title>
                <Paragraph>
                  <strong>Fechas: </strong>
                  {new Date(reserva.rangoFechas.desde).toLocaleDateString()} -{' '}
                  {new Date(reserva.rangoFechas.hasta).toLocaleDateString()}
                </Paragraph>
                <Paragraph>
                  <strong>Huésped: </strong>
                  {reserva.nombreHuesped}
                </Paragraph>
                <Paragraph>
                  <Tag color={getTagColor(reserva.estadoReserva)}>{reserva.estadoReserva}</Tag>
                </Paragraph>
                {reserva.estadoReserva === 'PENDIENTE' && (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleConfirmar(reserva)}
                  >
                    Confirmar
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MisAlojamientosPage;
