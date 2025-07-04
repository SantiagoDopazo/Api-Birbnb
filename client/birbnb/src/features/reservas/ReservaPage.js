import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Tag, Typography, Divider, message, Spin, Button, Modal, Input, Empty
} from 'antd';
import { getReservasPorUsuario, getAlojamientoPorId, rechazarReserva } from '../../lib/api';
import {
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import './ReservaPage.css';

const { Title, Paragraph, Text } = Typography;

const estadoColor = {
  CONFIRMADA: 'green',
  PENDIENTE: 'orange',
  CANCELADA: 'red',
};

const estadoTexto = {
  CONFIRMADA: 'Confirmada',
  PENDIENTE: 'Pendiente',
  CANCELADA: 'Cancelada',
};

const ReservaPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);

  const cargarReservas = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      message.error('Debes estar logueado para ver tus reservas');
      setLoading(false);
      return;
    }

    try {
      const res = await getReservasPorUsuario(usuario.id);
      const reservasData = res.data;

      const reservasConAlojamiento = await Promise.all(
        reservasData.map(async (reserva) => {
          try {
            const resAloj = await getAlojamientoPorId(reserva.alojamiento);
            return { ...reserva, alojamiento: resAloj.data };
          } catch (error) {
            return { ...reserva, alojamiento: { nombre: 'Alojamiento no disponible' } };
          }
        })
      );

      reservasConAlojamiento.sort((a, b) => {
        if (a.estadoReserva === 'CANCELADA' && b.estadoReserva !== 'CANCELADA') return 1;
        if (a.estadoReserva !== 'CANCELADA' && b.estadoReserva === 'CANCELADA') return -1;

        return new Date(b.fechaAlta) - new Date(a.fechaAlta);
      });

      setReservas(reservasConAlojamiento);
    } catch (error) {
      message.error('Error al cargar tus reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelarReserva = (reserva) => {
    let motivo = '';

    Modal.confirm({
      title: '¿Estás seguro de cancelar esta reserva?',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Vas a cancelar la reserva para <strong>{reserva.alojamiento.nombre}</strong></p>
          <p>Fechas: {dayjs(reserva.rangoFechas?.desde).format('DD/MM/YYYY')} - {dayjs(reserva.rangoFechas?.hasta).format('DD/MM/YYYY')}</p>
          <p style={{ color: '#ff4d4f' }}>Esta acción no se puede deshacer.</p>
          <Input.TextArea
            placeholder="Motivo de cancelación"
            rows={3}
            onChange={(e) => motivo = e.target.value}
          />
        </div>
      ),
      okText: 'Sí, cancelar',
      okType: 'danger',
      cancelText: 'No, mantener reserva',
      async onOk() {
        if (!motivo.trim()) {
          message.warning('Debe ingresar un motivo de cancelación');
          return Promise.reject(); // previene cierre del modal
        }
        setCancelando(reserva.id);
        try {
          await rechazarReserva({
            ...reserva,
            motivoCancelacion: motivo,
          });
          message.success('Reserva cancelada exitosamente');
          cargarReservas();
        } catch (err) {
          message.error('Error al cancelar la reserva');
        } finally {
          setCancelando(null);
        }
      },
    });
  };

  const calcularNoches = (rangoFechas) => {
    if (!rangoFechas?.desde || !rangoFechas?.hasta) return 0;
    return dayjs(rangoFechas.hasta).diff(dayjs(rangoFechas.desde), 'day');
  };

  const calcularPrecioTotal = (reserva) => {
    const noches = calcularNoches(reserva.rangoFechas);
    return noches * (reserva.precioPorNoche || 0);
  };

  const puedesCancelar = (reserva) =>
    reserva.estadoReserva === 'PENDIENTE' || reserva.estadoReserva === 'CONFIRMADA';

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p style={{ marginTop: '1rem' }}>Cargando tus reservas...</p>
      </div>
    );
  }

  if (!reservas.length) {
    return (
      <div className="reserva-page-container">
        <Title level={2}>Mis Reservas</Title>
        <Empty
          description="No tenés reservas aún"
          image={<CalendarOutlined style={{ fontSize: 64, color: '#ccc' }} />}
        >
          <Link to="/busquedaAlojamientos">
            <Button type="primary">Explorar Alojamientos</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="reserva-page-container">
      <div className="reserva-header">
        <Title level={2}>Mis Reservas</Title>
        <Text type="secondary">Tenés {reservas.length} reserva{reservas.length !== 1 ? 's' : ''}</Text>
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        {reservas.map((reserva) => {
          const alojamiento = reserva.alojamiento || {};
          const fotos = Array.isArray(alojamiento.fotos) ? alojamiento.fotos : [];
          const foto = fotos.length > 0 ? fotos[0] : '/images/default-alojamiento.jpg';
          const noches = calcularNoches(reserva.rangoFechas);
          const precioTotal = calcularPrecioTotal(reserva);

          return (
            <Col xs={24} lg={12} key={reserva.id}>
              <Card
                className={`reserva-card ${reserva.estadoReserva?.toLowerCase()}`}
                hoverable
                cover={<img alt={alojamiento.nombre} src={foto} className="reserva-image" />}
                actions={[
                  <Link to="/busquedaAlojamientos" key="buscar">
                    <Button type="text">Ver más alojamientos</Button>
                  </Link>,
                  ...(puedesCancelar(reserva) ? [
                    <Button
                      key="cancelar"
                      type="text"
                      danger
                      icon={<CloseCircleOutlined />}
                      loading={cancelando === reserva.id}
                      onClick={() => handleCancelarReserva(reserva)}
                    >
                      Cancelar
                    </Button>
                  ] : [])
                ]}
              >
                <div className="reserva-content">
                  <div className="reserva-header-card">
                    <Title level={4} className="reserva-title">{alojamiento.nombre}</Title>
                    <Tag color={estadoColor[reserva.estadoReserva] || 'default'}>
                      {estadoTexto[reserva.estadoReserva] || reserva.estadoReserva}
                    </Tag>
                  </div>

                  <Paragraph type="secondary" className="reserva-location">
                    <EnvironmentOutlined /> {alojamiento.direccion?.ciudad?.nombre || ''}, {alojamiento.direccion?.ciudad?.pais?.nombre || ''}
                  </Paragraph>

                  <div className="reserva-details">
                    <div className="reserva-detail-item">
                      <CalendarOutlined />
                      <div>
                        <Text strong>Fechas:</Text><br />
                        <Text>{dayjs(reserva.rangoFechas?.desde).format('DD/MM/YYYY')} - {dayjs(reserva.rangoFechas?.hasta).format('DD/MM/YYYY')}</Text><br />
                        <Text type="secondary">{noches} noche{noches !== 1 ? 's' : ''}</Text>
                      </div>
                    </div>
                    <div className="reserva-detail-item">
                      <UserOutlined />
                      <div>
                        <Text strong>Huéspedes:</Text><br />
                        <Text>{reserva.cantHuespedes} persona{reserva.cantHuespedes !== 1 ? 's' : ''}</Text>
                      </div>
                    </div>
                    <div className="reserva-detail-item">
                      <DollarOutlined />
                      <div>
                        <Text strong>Precio:</Text><br />
                        <Text>${reserva.precioPorNoche} por noche</Text><br />
                        <Text strong>Total: ${precioTotal}</Text>
                      </div>
                    </div>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <div className="reserva-meta">
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Reservado el {dayjs(reserva.fechaAlta).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ReservaPage;
