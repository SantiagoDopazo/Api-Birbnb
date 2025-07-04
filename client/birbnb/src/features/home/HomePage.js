import React from 'react';
import { Carousel, Button, Card, Row, Col } from 'antd';
import { SearchOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AboutUs from '../aboutUs/AboutUs';
import ContactUs from '../contactUs/ContactUs';
import './HomePage.css';
import { message } from 'antd';
import { useEffect } from 'react';
import 'antd/dist/reset.css';

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};


const HomePage = () => {
    return (
        <div>

            <div className="hero-section">
                <div className="carousel-container">
                    <Carousel autoplay autoplaySpeed={5000}>
                        <div>
                            <img src="/images/imagen6.jpg" alt="Habitación elegante" className="carousel-img" />
                        </div>
                        <div>
                            <img src="/images/imagen3.jpg" alt="Habitación" className="carousel-img" />
                        </div>
                        <div>
                            <img src="/images/imagen9.jpg" alt="Habitación" className="carousel-img" />
                        </div>
                        <div>
                            <img src="/images/imagen10.jpg" alt="Habitación" className="carousel-img" />
                        </div>
                    </Carousel>
                    

                    <div className="hero-overlay">
                        <div className="hero-content">
                            <h1 className="hero-title">Encuentra tu próximo destino</h1>
                            <p className="hero-subtitle">
                                Descubre alojamientos únicos en los mejores destinos
                            </p>
                            <div className="hero-actions">
                                <Link to="/busquedaAlojamientos">
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        icon={<SearchOutlined />}
                                        className="cta-button"
                                    >
                                        Explorar Alojamientos
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="features-section">
                <div className="container">
                    <h2 className="section-title">¿Por qué elegir BirBnB?</h2>
                    <Row gutter={[32, 32]} justify="center">
                        <Col xs={24} md={8}>
                            <Card className="feature-card" bordered={false}>
                                <div className="feature-icon">
                                    <HomeOutlined />
                                </div>
                                <h3>Alojamientos únicos</h3>
                                <p>Desde casas acogedoras hasta apartamentos modernos, encuentra el lugar perfecto para tu estadía.</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="feature-card" bordered={false}>
                                <div className="feature-icon">
                                    <CalendarOutlined />
                                </div>
                                <h3>Reserva fácil</h3>
                                <p>Sistema de reservas simple y seguro. Confirmación instantánea para que planifiques sin preocupaciones.</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card className="feature-card" bordered={false}>
                                <div className="feature-icon">
                                    <SearchOutlined />
                                </div>
                                <h3>Búsqueda avanzada</h3>
                                <p>Filtra por precio, ubicación, características y encuentra exactamente lo que necesitas.</p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>


            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>¿Listo para tu próxima aventura?</h2>
                        <p>Miles de alojamientos te están esperando</p>
                        <div className="cta-buttons">
                            <Link to="/busquedaAlojamientos">
                                <Button type="primary" size="large" icon={<SearchOutlined />}>
                                    Buscar Alojamientos
                                </Button>
                            </Link>
                            <Link to="/reservas">
                                <Button size="large" icon={<CalendarOutlined />}>
                                    Ver Mis Reservas
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


            <div className='about'>
                <AboutUs />
                <ContactUs />
            </div>
        </div>
    );
};

export default HomePage;