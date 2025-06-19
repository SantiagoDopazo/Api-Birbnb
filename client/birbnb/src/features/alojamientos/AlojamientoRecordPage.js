import React, { useState } from 'react';
import { Card, Typography, Tag, Carousel, Row, Col, Divider, DatePicker, Space, InputNumber, Button, message } from 'antd';
import {
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { crearReserva } from '../../lib/api';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const AlojamientoRecordPage = () => {
  const [rangoFechas, setRangoFechas] = useState([]);
  const [cantHuespedes, setCantHuespedes] = useState(1);
  const navigate = useNavigate();
  const { state } = useLocation();
  const alojamiento = state?.alojamiento;

  if (!alojamiento) return <div>No se encontró el alojamiento.</div>;

  const handleChange = (dates, dateStrings) => {
    setRangoFechas(dateStrings);
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
      message.success('Reserva creada exitosamente');

    } catch (error) {
      console.error(error);
      message.error('Error al crear la reserva');
    }
  };

  return (
    <div>
      <Row gutter={[0, 32]} justify="center" align="top" wrap>
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
            <Space direction="vertical" size={12}>
            <Text strong>Seleccioná las fechas:</Text>
            <RangePicker onChange={handleChange} />

            <Text strong>Cantidad de personas:</Text>
            <InputNumber
                min={1}
                max={alojamiento.cantHuespedesMax}
                value={cantHuespedes}
                onChange={setCantHuespedes}
            />

            <Button
                type="primary"
                onClick={handleReserva}
                disabled={!rangoFechas || rangoFechas.length !== 2}
            >
                Reservar
            </Button>
            </Space>
            <Divider />
            <Text strong>Características:</Text>
            <div style={{ marginTop: '0.5rem' }}>
              {alojamiento.caracteristicas.map((car, idx) => (
                <Tag icon={<HomeOutlined />} color="blue" key={idx}>
                  {car}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AlojamientoRecordPage;