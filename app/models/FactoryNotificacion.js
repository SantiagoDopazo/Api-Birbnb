export class FactoryNotificacion {

    crearSegunReserva(reserva) {
        const strategies = {
            'PENDIENTE': () => new Notification(reserva.resumen(), reserva.alojamiento.anfitrion, reserva.fechaAlta),
            'CONFIRMADA': () => new Notification('La reserva fue confirmada por el anfitrión', reserva.huespedReservador, reserva.fechaAlta),
            'CANCELADA': () => new Notification(`El huésped ha cancelado la reserva. El motivo fue: ${reserva.motivoCancelacion}`, reserva.huespedReservador, reserva.fechaAlta)
        };
    
        const crearNotificacion = strategies[reserva.estado];
        if (crearNotificacion) {
            return crearNotificacion();
        }
    
        throw new Error(`Estado de reserva no soportado: ${reserva.estado}`);
    }
}