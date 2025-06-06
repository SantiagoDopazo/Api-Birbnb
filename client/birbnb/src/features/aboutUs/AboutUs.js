import React from 'react';

const AboutUs = () => {
  return (
    <section className='aboutUs'>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#333' }}>
          Sobre nosotros
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555' }}>
          En nuestra plataforma creemos que todos merecen experimentar el mundo como un local. 
          Conectamos viajeros con anfitriones apasionados para que puedan disfrutar alojamientos únicos, 
          experiencias auténticas y una comunidad de confianza. Ya sea que busques una escapada de fin de semana 
          o una estadía prolongada, estamos aquí para ayudarte a sentirte como en casa, estés donde estés.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;