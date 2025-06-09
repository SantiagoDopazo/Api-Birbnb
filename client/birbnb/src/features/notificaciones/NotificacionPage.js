import React from 'react';
import { Card, Row, Col, Tag, Typography, Divider, Button } from 'antd';
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './NotificacionPage.css';

const { Title, Paragraph, Text } = Typography;

const notificaciones = [
  {
    id: '1',
    mensaje: 'Tu reserva en Anor Londo Palace fue confirmada.',
    fechaAlta: '2025-06-10 14:30',
    leida: false,
    estado: 'CONFIRMADA',
  },
  {
    id: '2',
    mensaje: 'Tu reserva en Casa del Lago fue cancelada por el anfitrión.',
    fechaAlta: '2025-06-09 09:15',
    leida: true,
    estado: 'CANCELADA',
  },
  {
    id: '3',
    mensaje: 'Tienes una nueva reserva pendiente de confirmación.',
    fechaAlta: '2025-06-08 18:00',
    leida: false,
    estado: 'PENDIENTE',
  },
];

const estadoColor = {
  CONFIRMADA: 'green',
  PENDIENTE: 'orange',
  CANCELADA: 'red',
};

const NotificacionPage = () => (
  <div className="notificaciones-page-container">
    <Title level={2}><BellOutlined /> Notificaciones</Title>
    <Divider />
    <Row gutter={[24, 24]}>
      {notificaciones.map((noti) => (
        <Col xs={24} md={12} key={noti.id}>
          <Card
            className={noti.leida ? 'notificacion-card leida' : 'notificacion-card'}
            hoverable
            actions={[
              !noti.leida && (
                <Button type="link" icon={<CheckCircleOutlined />} key="marcar-leida">
                  Marcar como leída
                </Button>
              ),
            ]}
          >
            <Tag color={estadoColor[noti.estado]}>{noti.estado}</Tag>
            <Paragraph style={{ margin: '8px 0' }}>
              <Text>{noti.mensaje}</Text>
            </Paragraph>
            <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 0 }}>
              {noti.fechaAlta}
            </Paragraph>
            {noti.leida && (
              <Tag color="blue" style={{ marginTop: 8 }}>Leída</Tag>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default NotificacionPage;