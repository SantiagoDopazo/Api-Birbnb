import { Notificacion } from "./Notificacion.js"
export class FactoryNotificacion {

    crearSegunReserva(reserva) {
        const strategies = {
            'PENDIENTE': () => new Notificacion(reserva.resumen(), reserva.alojamiento.anfitrion, reserva.fechaAlta),
            'CONFIRMADA': () => new Notificacion('La reserva fue confirmada por el anfitrión', reserva.huespedReservador, reserva.fechaAlta),
            'CANCELADA': () => new Notificacion(`El huésped ha cancelado la reserva. El motivo fue: ${reserva.motivoCancelacion}`, reserva.huespedReservador, reserva.fechaAlta)
        };
    
        const crearNotificacion = strategies[reserva.estado];
        if (crearNotificacion) {
            return crearNotificacion();
        }
    
        throw new Error(`Estado de reserva no soportado: ${reserva.estado}`);
    }
}