import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Typography, Divider, Button, message } from 'antd';
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './NotificacionPage.css';
import {
  getNotificacionesPorUsuario,
  marcarNotificacionComoLeida
} from '../../lib/api';

const { Title, Paragraph, Text } = Typography;

const estadoColor = {
  CONFIRMADA: 'green',
  PENDIENTE: 'orange',
  CANCELADA: 'red',
};

const NotificacionPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuarioId = JSON.parse(localStorage.getItem('usuario'))?.id;

  const fetchNotificaciones = async () => {
    try {
      const response = await getNotificacionesPorUsuario(usuarioId);

      const ordenadas = response.data.sort((a, b) => {
        if (a.leida === b.leida) return 0;
        return a.leida ? 1 : -1; 
      });

      setNotificaciones(ordenadas);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      message.error('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      fetchNotificaciones();
    } else {
      setLoading(false);
      message.warning('Usuario no logueado');
    }
  }, [usuarioId]);

  const handleMarcarComoLeida = async (id) => {
    try {
      await marcarNotificacionComoLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      message.success('Notificación marcada como leída');

      window.dispatchEvent(new CustomEvent('notificacionesActualizadas'));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      message.error('No se pudo marcar la notificación como leída');
    }
  };

  return (
    <div className="notificaciones-page-container">
      <Title level={2}><BellOutlined /> Notificaciones</Title>
      <Divider />

      {loading ? (
        <p>Cargando notificaciones...</p>
      ) : notificaciones.length === 0 ? (
        <p>No tienes notificaciones por el momento.</p>
      ) : (
        <Row gutter={[24, 24]}>
          {notificaciones.map((noti) => (
            <Col xs={24} md={12} key={noti.id}>
              <Card
                className={noti.leida ? 'notificacion-card leida' : 'notificacion-card'}
                hoverable
                actions={[
                  !noti.leida && (
                    <Button
                      type="link"
                      icon={<CheckCircleOutlined />}
                      key="marcar-leida"
                      onClick={() => handleMarcarComoLeida(noti.id)}
                    >
                      Marcar como leída
                    </Button>
                  ),
                ]}
              >
                <Tag color={estadoColor[noti.estado] || 'default'}>{noti.estado}</Tag>
                <Paragraph style={{ margin: '8px 0' }}>
                  <Text>{noti.mensaje}</Text>
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 0 }}>
                  {new Date(noti.fechaAlta).toLocaleString('es-AR')}
                </Paragraph>
                {noti.leida && (
                  <Tag color="blue" style={{ marginTop: 8 }}>Leída</Tag>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default NotificacionPage;