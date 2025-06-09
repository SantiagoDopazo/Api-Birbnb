import './navbar.css';
import React from 'react';
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';



const Navbar = () => {
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
          <Space direction="vertical" size={16}>
            <Space wrap size={16}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Space>
          </Space>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;