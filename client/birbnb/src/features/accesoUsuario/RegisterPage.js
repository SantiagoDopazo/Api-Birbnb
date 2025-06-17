import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { UserAddOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { crearUsuario } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css'; // para versiones antd v5+


const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const nuevoUsuario = {
        nombre: values.nombre,
        email: values.email,
        tipo: values.tipo.toUpperCase(),
        password: values.password
      };
      await crearUsuario(nuevoUsuario);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      window.dispatchEvent(new Event('usuarioCambiado'));
      message.success('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error(error);
      message.error('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <Card title={<Title level={3}>Registrarse</Title>} style={{ width: 400 }}>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Nombre completo"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingresá tu nombre' }]}
          >
            <Input prefix={<UserAddOutlined />} placeholder="Nombre completo" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresá tu email' },
              { type: 'email', message: 'El email no es válido' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Tipo de usuario"
            name="tipo"
            rules={[{ required: true, message: 'Seleccioná un tipo de usuario' }]}
          >
            <Select placeholder="Seleccionar tipo">
              <Option value="anfitrion">Anfitrión</Option>
              <Option value="huesped">Huésped</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresá una contraseña' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Registrarse
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
