import React, { useState } from 'react';
import { Card, Typography, Tag, Carousel, Row, Col, Divider, DatePicker, Space } from 'antd';
import {
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;

const AlojamientoRecordPage = () => {
    const [rangoFechas, setRangoFechas] = useState();

    const handleChange = (dates, dateStrings) => {
        setRangoFechas(dateStrings);
    };
    const { state } = useLocation();
    const alojamiento = state?.alojamiento;
    if (!alojamiento) return <div>No se encontró el alojamiento.</div>;

    const imagenes = [
        "https://picsum.photos/id/1005/800/400",
        "https://picsum.photos/id/1011/800/400",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ]

    return (
    <div>
        <Row gutter={[32, 32]} wrap>
            <Col xs={24} md={12}>
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

            <Col xs={24} md={12}>
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
                <Paragraph>
                    <Space direction="vertical" size={12}>
                    <RangePicker onChange={handleChange} />
                    </Space>
                </Paragraph>
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