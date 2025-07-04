import './navbar.css';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserOutlined, BellOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Avatar, Space, Dropdown, Menu, message, Badge } from 'antd';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { getNotificacionesPorUsuario } from '../../lib/api';

const Navbar = () => {
  const [usuario, setUsuario] = useState(undefined); // undefined = aún cargando
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = () => {
      const userData = localStorage.getItem('usuario');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUsuario(parsedUser);
      } else {
        setUsuario(null);
      }
    };

    cargarUsuario();

    window.addEventListener('usuarioCambiado', cargarUsuario);

    return () => {
      window.removeEventListener('usuarioCambiado', cargarUsuario);
    };
  }, []);

  useEffect(() => {
    const cargarNotificaciones = async (usuarioId) => {
      try {
        const res = await getNotificacionesPorUsuario(usuarioId, false); // false = solo no leídas
        const total = res.data?.length || 0;
        setNotificacionesNoLeidas(total);
      } catch (err) {
        console.error('Error cargando notificaciones:', err);
        setNotificacionesNoLeidas(0);
      }
    };

    if (usuario?.id) {
      cargarNotificaciones(usuario.id);

      const actualizarNotificaciones = () => cargarNotificaciones(usuario.id);
      window.addEventListener('notificacionesActualizadas', actualizarNotificaciones);

      return () => {
        window.removeEventListener('notificacionesActualizadas', actualizarNotificaciones);
      };
    }
  }, [usuario]);

  if (usuario === undefined) {
    return null; // todavía cargando
  }

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setNotificacionesNoLeidas(0); // 🔧 resetear badge
    message.info('Has cerrado sesión');
    navigate('/login', { replace: true });
  };

  const menu = (
    <Menu>
      {usuario ? (
        <>
          <Menu.Item key="nombre" disabled>
            {usuario.nombre}
          </Menu.Item>
          <Menu.Item key="cerrar" icon={<LogoutOutlined />} onClick={cerrarSesion}>
            Cerrar sesión
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login" icon={<LoginOutlined />}>
            <Link to="/login">Iniciar sesión</Link>
          </Menu.Item>
          <Menu.Item key="register" icon={<UserOutlined />}>
            <Link to="/register">Registrarse</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img src="images/logo.png" alt="Logo" width="100" className="logo" />
          </Link>
        </div>

        <div className="navbar-center">
          <NavLink
            to="/busquedaAlojamientos"
            className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'}
          >
            <div className="nav-item">
              <img src="images/casa.png" alt="Alojamientos" className="icono-nav" />
              <span className="nav-text">Alojamientos</span>
            </div>
          </NavLink>

          <NavLink
            to="/reservas"
            className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'}
          >
            <div className="nav-item">
              <img src="images/casa.png" alt="Reservas" className="icono-nav" />
              <span className="nav-text">Reservas</span>
            </div>
          </NavLink>

          {usuario?.tipo === 'ANFITRION' && (
            <NavLink
              to="/mis-alojamientos"
              className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'}
            >
              <div className="nav-item">
                <img src="images/casa.png" alt="Mis Alojamientos" className="icono-nav" />
                <span className="nav-text">Mis Alojamientos</span>
              </div>
            </NavLink>
          )}
        </div>

        <div className="navbar-right">
          <NavLink
            to="/notificaciones"
            className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'}
            style={{ marginRight: 16 }}
          >
            <Badge 
              count={notificacionesNoLeidas > 0 ? notificacionesNoLeidas : 0}
              overflowCount={99}
              offset={[-2, 2]}
              style={{ backgroundColor: '#f5222d' }}
            >
              <span style={{ display: 'inline-block', position: 'relative' }}>
                <BellOutlined style={{ fontSize: 24 }} />
              </span>
            </Badge>
          </NavLink>

          <div style={{ marginRight: 16 }}>
            <ThemeToggle size="large" />
          </div>

          <Space direction="vertical" size={16}>
            <Dropdown overlay={menu} placement="bottomRight" arrow trigger={['click']}>
              <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
