import './navbar.css';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserOutlined, BellOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { Avatar, Space, Dropdown, Menu } from 'antd';
import { message } from 'antd';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Navbar = () => {
  const [usuario, setUsuario] = useState(undefined); // undefined = aún cargando
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = () => {
      const userData = localStorage.getItem('usuario');
      if (userData) setUsuario(JSON.parse(userData));
      else setUsuario(null);
    };

    cargarUsuario();

    window.addEventListener('usuarioCambiado', cargarUsuario);

    return () => {
      window.removeEventListener('usuarioCambiado', cargarUsuario);
    };
  }, []);

  if (usuario === undefined) {
    return null;
  }

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
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
            className={({ isActive }) =>
              isActive ? 'nav-link activo' : 'nav-link'
            }
          >
            <div className="nav-item">
              <img src="images/casa.png" alt="Alojamientos" className="icono-nav" />
              <span className="nav-text">Alojamientos</span>
            </div>
          </NavLink>

          <NavLink
            to="/reservas"
            className={({ isActive }) =>
              isActive ? 'nav-link activo' : 'nav-link'
            }
          >
            <div className="nav-item">
              <img src="images/casa.png" alt="Reservas" className="icono-nav" />
              <span className="nav-text">Reservas</span>
            </div>
          </NavLink>
        </div>

        <div className="navbar-right">
          <NavLink
            to="/notificaciones"
            className={({ isActive }) =>
              isActive ? 'nav-link activo' : 'nav-link'
            }
            style={{ marginRight: 16 }}
          >
            <BellOutlined style={{ fontSize: 28 }} />
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
