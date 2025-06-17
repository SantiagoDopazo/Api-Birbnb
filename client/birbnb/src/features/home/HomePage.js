import React from 'react';
import { Carousel } from 'antd';
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
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