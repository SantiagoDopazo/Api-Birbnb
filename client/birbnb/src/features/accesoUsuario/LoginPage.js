import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../../lib/api';  
import { useEffect } from 'react';

const { Title } = Typography;

const LoginPage = () => {

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      navigate('/');
    }
  }, []);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data: usuario } = await loginUsuario({
        email: values.email,
        password: values.password
      });
      console.log('usuario: ', JSON.stringify(usuario))
      localStorage.setItem('usuario', JSON.stringify(usuario));
      message.success('Inicio de sesión exitoso');
      window.dispatchEvent(new Event('usuarioCambiado'));
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <Card title={<Title level={3}>Iniciar sesión</Title>} style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Por favor ingresá tu email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresá tu contraseña' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
