import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, InstagramOutlined, FacebookOutlined } from '@ant-design/icons';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <section className='contact'>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#333' }}>
          Contactanos
        </h2>
        <div style={{ fontSize: '1.1rem', color: '#555', lineHeight: '2' }}>
          <p>
            <MailOutlined style={{ marginRight: '8px', color: '#364d79' }} />
            birbnb@gmail.com
          </p>
          <p>
            <PhoneOutlined style={{ marginRight: '8px', color: '#364d79' }} />
            +54 11 3927-6499
          </p>
          <p>
            <EnvironmentOutlined style={{ marginRight: '8px', color: '#364d79' }} />
            Av. Castro Barros 2085, Buenos Aires, Argentina
          </p>
          <div style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 12px', color: '#364d79' }}>
              <InstagramOutlined />
            </a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 12px', color: '#364d79' }}>
              <FacebookOutlined />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;