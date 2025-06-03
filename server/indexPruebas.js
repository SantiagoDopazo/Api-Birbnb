
import { Alojamiento } from './app/models/entities/Alojamiento.js';
import { CambioEstadoReserva } from './app/models/entities/CambioEstadoReserva.js';
import { Ciudad } from './app/models/entities/Ciudad.js';
import { Direccion } from './app/models/entities/Direccion.js';
import { FactoryNotificacion } from './app/models/entities/FactoryNotificacion.js';
import { Foto } from './app/models/entities/Foto.js';
import { Notificacion } from './app/models/entities/Notificacion.js';
import { Pais } from './app/models/entities/Pais.js';
import { RangoFechas } from './app/models/entities/RangoFechas.js'
import { Usuario } from './app/models/entities/Usuario.js'
import { Reserva } from './app/models/entities/Reserva.js'
import { EstadoPendiente, EstadoCancelada, EstadoConfirmada } from './app/models/entities/EstadoReserva.js';

const pais = new Pais('Argentina');
const ciudad = new Ciudad('Buenos Aires', pais);
const direccion = new Direccion('Falsa', 123, ciudad, -34.6, -58.4);
const axel = new Usuario('Axel', 'axel@email.com', 'Huesped');
const juan = new Usuario('Juan', 'juan@email.com', 'Anfitrion');
const alojamiento = new Alojamiento(juan, 'Casa', 'Linda casa con patio', 150, 'USD', '14:00', '11:00', direccion, 4);
const fechas = new RangoFechas(new Date(2025, 4, 1), new Date(2025, 4, 5));
const fechasSuperpuestas = new RangoFechas(new Date(2025, 3, 29), new Date(2025, 4, 2));
const fechasNoSuperpuestas = new RangoFechas(new Date(2025, 3, 20), new Date(2025, 3, 29));
const estadoPendiente = new EstadoPendiente()
const estadoConfirmada = new EstadoConfirmada()
const estadoCancelada = new EstadoCancelada()
const reserva = new Reserva(new Date(), axel, 2, 'Casa', fechas, 150, estadoPendiente);

console.log('Prueba Alojamiento:');
alojamiento.agregarCaracteristica('WiFi');
alojamiento.agregarFoto(new Foto('Vista al mar', '/path/foto.jpg'));
alojamiento.agregarReserva(reserva);
console.log('- ¿Tiene WiFi?', alojamiento.tenesCaracteristica('WiFi'));
console.log('- ¿Disponible en fechas?', alojamiento.estaDisponibleEn(fechasSuperpuestas));
console.log('- ¿Disponible en fechas?', alojamiento.estaDisponibleEn(fechasNoSuperpuestas));
console.log('- ¿Precio entre 100 y 200?', alojamiento.tuPrecioEstaDentroDe(100, 200));
console.log('- ¿Pueden alojarse 3?', alojamiento.puedenAlojarse(3));

console.log('\nPrueba Reserva:');
console.log('- Estado inicial:', reserva.estado);
reserva.actualizarEstado(estadoConfirmada);
console.log('- Estado actualizado:', reserva.estado);
reserva.motivoCancelacion = 'Cambio de planes';
console.log('- Motivo cancelación:', reserva.motivoCancelacion);
console.log('- Resumen:', reserva.resumen());

console.log('\nPrueba Notificación:');
const notificacion = new Notificacion('Mensaje', axel, new Date());
notificacion.marcarComoLeida();
console.log('- Notificación marcada como: ', notificacion.leida);
console.log('En fecha: ', notificacion.fechaLeida?.toLocaleString('es-AR', {timeZone: 'America/Argentina/Buenos_Aires'}));

console.log('\nPrueba FactoryNotificacion:');
const factory = new FactoryNotificacion();
const reserva2 = new Reserva(new Date(), axel, 1, alojamiento, fechas, 200, estadoPendiente);
console.log('- Notificación generada:', factory.crearSegunReserva(reserva2));

console.log('\nInstanciación de otras clases sin errores:');
new CambioEstadoReserva(new Date(), estadoPendiente, reserva, 'motivo',axel);
new Foto('Descripción', '/foto.png');
console.log('- Estado actualizado:', reserva.estado);
console.log('- Motivo cancelación:', reserva.motivoCancelacion);