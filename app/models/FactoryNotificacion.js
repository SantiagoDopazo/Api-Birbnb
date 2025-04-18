export class FactoryNotificacion {
    crearSegunReserva(reserva) {
        return new Notification(, reserva.huespedReservador, reserva.fechaAlta)
    }
}