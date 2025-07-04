import React, { useEffect, useState } from 'react';
import { 
  Card, Row, Col, Tag, Typography, Divider, Button, message, 
  Select, Badge, Skeleton, Dropdown, Menu, Empty
} from 'antd';
import { 
  BellOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  CalendarOutlined, UserOutlined, HomeOutlined, DollarOutlined,
  FilterOutlined, SortAscendingOutlined, ExclamationCircleOutlined, 
  CheckOutlined, SettingOutlined
} from '@ant-design/icons';

import './NotificacionPage.css';
import {
  getNotificacionesPorUsuario,
  marcarNotificacionComoLeida
} from '../../lib/api';

const { Title } = Typography;
const { Option } = Select;

const NotificacionPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const [sortBy, setSortBy] = useState('date');

  const usuarioId = JSON.parse(localStorage.getItem('usuario'))?.id;

  const fetchNotificaciones = async () => {
    try {
      const response = await getNotificacionesPorUsuario(usuarioId);
      const ordenadas = response.data.sort((a, b) => {
        if (a.leida === b.leida) {
          return new Date(b.fechaAlta) - new Date(a.fechaAlta);
        }
        return a.leida ? 1 : -1;
      });
      setNotificaciones(ordenadas);
      setFilteredNotificaciones(ordenadas);
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

  useEffect(() => {
    let filtered = [...notificaciones];

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.leida);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.leida);
    }



    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.fechaAlta) - new Date(a.fechaAlta);
      } else if (sortBy === 'priority') {
        return a.leida - b.leida;
      }
      return 0;
    });

    setFilteredNotificaciones(filtered);
  }, [notificaciones, filter, sortBy]);

  const handleMarcarComoLeida = async (id) => {
    try {
      await marcarNotificacionComoLeida(id);
      setNotificaciones(prev =>
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
      message.success('Notificación marcada como leída');
      window.dispatchEvent(new CustomEvent('notificacionesActualizadas'));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      message.error('No se pudo marcar la notificación como leída');
    }
  };

  const handleMarcarTodasComoLeidas = async () => {
    try {
      const unreadIds = notificaciones.filter(n => !n.leida).map(n => n.id);
      await Promise.all(unreadIds.map(id => marcarNotificacionComoLeida(id)));
      setNotificaciones(prev =>
        prev.map(n => ({ ...n, leida: true }))
      );
      message.success('Todas las notificaciones marcadas como leídas');
      window.dispatchEvent(new CustomEvent('notificacionesActualizadas'));
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      message.error('No se pudieron marcar todas las notificaciones');
    }
  };

  const getNotificationIcon = (mensaje) => {
    if (mensaje.includes('realizó una reserva')) {
      return <CalendarOutlined style={{ color: '#fa8c16' }} />;
    } else if (mensaje.includes('confirmada')) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (mensaje.includes('cancelada') || mensaje.includes('cancelado') || mensaje.includes('cancelaron')) {
      return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    }
    return <BellOutlined style={{ color: '#1890ff' }} />;
  };

  const getNotificationClass = (mensaje) => {
    if (mensaje.includes('realizó una reserva')) {
      return 'reserva-pendiente';
    } else if (mensaje.includes('confirmada')) {
      return 'reserva-confirmada';
    } else if (mensaje.includes('cancelada') || mensaje.includes('cancelado') || mensaje.includes('cancelaron')) {
      return 'reserva-cancelada';
    }
    return '';
  };

  const extractReservationInfo = (mensaje) => {
    const info = {};
    
    const guestMatch = mensaje.match(/^([^r]+) realizó/);
    if (guestMatch) {
      info.huesped = guestMatch[1];
    }
    
    const accommodationMatch = mensaje.match(/alojamiento (.+?) desde/);
    if (accommodationMatch) {
      info.alojamiento = accommodationMatch[1];
    }
    
    const dateMatch = mensaje.match(/desde el (.+?) hasta el (.+?), por (\d+) día/);
    if (dateMatch) {
      info.fechaInicio = dateMatch[1];
      info.fechaFin = dateMatch[2];
      info.dias = dateMatch[3];
    }
    
    return info;
  };

  const unreadCount = notificaciones.filter(n => !n.leida).length;
  const todayCount = notificaciones.filter(n => {
    const today = new Date();
    const notiDate = new Date(n.fechaAlta);
    return notiDate.toDateString() === today.toDateString();
  }).length;

  const settingsMenu = (
    <Menu>
      <Menu.Item key="mark-all" onClick={handleMarcarTodasComoLeidas}>
        <CheckOutlined /> Marcar todas como leídas
      </Menu.Item>
      <Menu.Item key="preferences">
        <SettingOutlined /> Preferencias de notificación
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <div className="notificaciones-page-container">
        <div className="loading-skeleton">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="notificaciones-page-container">
      <div className="notificaciones-header">
        <div>
          <Title level={2}>
            <BellOutlined /> Notificaciones
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: 12 }} />
            )}
          </Title>
          <div className="notificaciones-stats">
            <div className={`stat-item ${unreadCount > 0 ? 'unread' : ''}`}>
              <BellOutlined />
              <span>{unreadCount} sin leer</span>
            </div>
            <div className="stat-item">
              <CalendarOutlined />
              <span>{todayCount} hoy</span>
            </div>
            <div className="stat-item">
              <UserOutlined />
              <span>{notificaciones.length} total</span>
            </div>
          </div>
        </div>
        <Dropdown overlay={settingsMenu} placement="bottomRight">
          <Button icon={<SettingOutlined />} />
        </Dropdown>
      </div>

      <div className="notificaciones-filters">
        <div className="filter-section">
          <FilterOutlined />
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 140 }}
          >
            <Option value="all">Todas</Option>
            <Option value="unread">Sin leer</Option>
            <Option value="read">Leídas</Option>
          </Select>
        </div>

        <div className="filter-section">
          <SortAscendingOutlined />
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 140 }}
          >
            <Option value="date">Por fecha</Option>
            <Option value="priority">Por prioridad</Option>
          </Select>
        </div>


      </div>

      <Divider />

      {filteredNotificaciones.length === 0 ? (
        <Empty
          className="empty-state"
          description="No hay notificaciones que mostrar"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredNotificaciones.map((noti) => {
            const reservationInfo = extractReservationInfo(noti.mensaje);
            const isReservation = noti.mensaje.includes('reserva');
            
            return (
              <Col xs={24} lg={12} key={noti.id}>
                <Card
                  className={`notificacion-card ${!noti.leida ? 'no-leida' : 'leida'} ${getNotificationClass(noti.mensaje)}`}
                  hoverable
                >
                  <div className="notificacion-layout">
                    <div className="notificacion-avatar">
                      {getNotificationIcon(noti.mensaje)}
                    </div>
                    <div className="notificacion-info">
                      <div className="notificacion-header">
                        <div className="notificacion-fecha">
                          <ClockCircleOutlined />
                          {new Date(noti.fechaAlta).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <div className="notificacion-content">
                        <div className="notificacion-mensaje">
                          {noti.mensaje}
                        </div>

                        {isReservation && reservationInfo.huesped && (
                          <div className="notificacion-detalles">
                            <div className="detalle-item">
                              <UserOutlined />
                              <span>{reservationInfo.huesped}</span>
                            </div>
                            {reservationInfo.dias && (
                              <div className="detalle-item">
                                <CalendarOutlined />
                                <span>{reservationInfo.dias} días</span>
                              </div>
                            )}
                            <div className="detalle-item">
                              <DollarOutlined />
                              <span>Ver precio</span>
                            </div>
                          </div>
                        )}

                        
                      </div>

                                             <div className="notificacion-acciones">
                         {!noti.leida && (
                           <Button
                             size="small"
                             icon={<CheckOutlined />}
                             className="accion-btn secondary"
                             onClick={() => handleMarcarComoLeida(noti.id)}
                           >
                             Marcar leída
                           </Button>
                         )}

                       </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default NotificacionPage;