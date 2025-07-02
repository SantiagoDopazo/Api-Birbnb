import React, { useState } from 'react';
import { Card, Typography, Tag, Carousel, Row, Col, Divider, DatePicker, Space, InputNumber, Button, message, Modal } from 'antd';
import {
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { crearReserva } from '../../lib/api';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const AlojamientoRecordPage = () => {
  const [rangoFechas, setRangoFechas] = useState([]);
  const [cantHuespedes, setCantHuespedes] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const alojamiento = state?.alojamiento;

  if (!alojamiento) return <div>No se encontró el alojamiento.</div>;

  const handleChange = (dates, dateStrings) => {
    setRangoFechas(dateStrings);
  };

  const calcularPrecioTotal = () => {
    if (!rangoFechas || rangoFechas.length < 2) return 0;
    
    const fechaInicio = dayjs(rangoFechas[0]);
    const fechaFin = dayjs(rangoFechas[1]);
    const noches = fechaFin.diff(fechaInicio, 'day');
    
    return noches * alojamiento.precioPorNoche;
  };

  const getNumerNoches = () => {
    if (!rangoFechas || rangoFechas.length < 2) return 0;
    
    const fechaInicio = dayjs(rangoFechas[0]);
    const fechaFin = dayjs(rangoFechas[1]);
    return fechaFin.diff(fechaInicio, 'day');
  };

  const handleReserva = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      message.error('Debes iniciar sesión para reservar');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!rangoFechas || rangoFechas.length < 2) {
      message.error('Seleccioná un rango de fechas');
      return;
    }

    if (cantHuespedes < 1 || cantHuespedes > alojamiento.cantHuespedesMax) {
      message.error('Cantidad de huéspedes inválida');
      return;
    }

    const noches = getNumerNoches();
    if (noches < 1) {
      message.error('Debes reservar al menos una noche');
      return;
    }

    setCargando(true);

    const reservaData = {
      fechaAlta: new Date().toISOString(),
      huespedReservador: usuario.id,
      cantHuespedes,
      alojamiento: alojamiento.id,
      rangoFechas: {
        desde: new Date(rangoFechas[0]).toISOString(),
        hasta: new Date(rangoFechas[1]).toISOString()
      },
      precioPorNoche: alojamiento.precioPorNoche,
      estadoReserva: 'PENDIENTE'
    };

    try {
      await crearReserva(reservaData);
      setReservaExitosa(true);
      message.success('¡Reserva creada exitosamente!');

    } catch (error) {
      console.error(error);
      message.error('Error al crear la reserva. Intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarModal = () => {
    setReservaExitosa(false);
    navigate('/reservas'); // Ir a ver mis reservas
  };

  const precioTotal = calcularPrecioTotal();
  const numeroNoches = getNumerNoches();

  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={[32, 32]} justify="center" align="top" wrap>
        <Col xs={24} md={24} lg={12}>
          <Carousel autoplay>
            {alojamiento.fotos.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`Imagen ${idx + 1}`}
                  style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            ))}
          </Carousel>
        </Col>

        <Col xs={24} md={24} lg={12}>
          <Card bordered={false}>
            <Title level={2}>{alojamiento.nombre}</Title>
            <Paragraph type="secondary">
              <EnvironmentOutlined /> {alojamiento.direccion.ciudad.nombre}, {alojamiento.direccion.ciudad.pais.nombre}
            </Paragraph>
            <Divider />
            <Paragraph>
              <UserOutlined /> Hasta {alojamiento.cantHuespedesMax} huéspedes
            </Paragraph>
            <Paragraph>
              <DollarOutlined /> ${alojamiento.precioPorNoche} por noche
            </Paragraph>
            <Paragraph>{alojamiento.descripcion}</Paragraph>
            <Paragraph>Check In: {alojamiento.horarioCheckIn}</Paragraph>
            <Paragraph>Check Out: {alojamiento.horarioCheckOut}</Paragraph>
            
            <Divider />
            
            <Card 
              title={<span><CalendarOutlined /> Reservar este alojamiento</span>}
              style={{ backgroundColor: '#fafafa', marginTop: '1rem' }}
            >
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Text strong>Seleccioná las fechas:</Text>
                  <RangePicker 
                    onChange={handleChange} 
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </div>

                <div>
                  <Text strong>Cantidad de personas:</Text>
                  <InputNumber
                    min={1}
                    max={alojamiento.cantHuespedesMax}
                    value={cantHuespedes}
                    onChange={setCantHuespedes}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                </div>

                {rangoFechas && rangoFechas.length === 2 && (
                  <div style={{ 
                    backgroundColor: 'white', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                  }}>
                    <Text strong>Resumen de la reserva:</Text>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>${alojamiento.precioPorNoche} x {numeroNoches} noche{numeroNoches !== 1 ? 's' : ''}</span>
                        <span>${precioTotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <span>Huéspedes: {cantHuespedes}</span>
                      </div>
                      <Divider style={{ margin: '0.5rem 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
                        <span>Total:</span>
                        <span>${precioTotal}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  onClick={handleReserva}
                  disabled={!rangoFechas || rangoFechas.length !== 2 || cargando}
                  loading={cargando}
                  style={{ width: '100%' }}
                  icon={<CheckCircleOutlined />}
                >
                  {cargando ? 'Creando reserva...' : 'Confirmar Reserva'}
                </Button>
              </Space>
            </Card>
            
            <Divider />
            <Text strong>Características:</Text>
            <div style={{ marginTop: '0.5rem' }}>
              {alojamiento.caracteristicas.map((car, idx) => (
                <Tag icon={<HomeOutlined />} color="blue" key={idx} style={{ margin: '4px' }}>
                  {car}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> ¡Reserva Confirmada!</span>}
        open={reservaExitosa}
        onOk={handleCerrarModal}
        onCancel={handleCerrarModal}
        cancelText="Seguir navegando"
        okText="Ver mis reservas"
        centered
      >
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '1rem' }} />
          <Title level={4}>Tu reserva ha sido creada exitosamente</Title>
          <Paragraph>
            Has reservado <strong>{alojamiento.nombre}</strong> para {numeroNoches} noche{numeroNoches !== 1 ? 's' : ''}.
          </Paragraph>
          <Paragraph type="secondary">
            Podés ver y gestionar todas tus reservas en la sección "Mis Reservas".
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default AlojamientoRecordPage;