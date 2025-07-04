import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ size = 'middle', shape = 'circle' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Tooltip 
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      placement="bottom"
    >
      <Button
        type="text"
        size={size}
        shape={shape}
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
        aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
      />
    </Tooltip>
  );
};

export default ThemeToggle; 