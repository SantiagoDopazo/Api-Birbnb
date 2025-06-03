export class EstadoPendiente {
    mensaje(reserva) {
        const huesped = reserva.huespedReservador;
        const alojamiento = reserva.alojamiento;

        const desde = reserva.rangoFechas.desde;
        const hasta = reserva.rangoFechas.hasta;

        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            throw new Error('Fechas de reserva inválidas');
        }

        const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

        return `${huesped} realizó una reserva para el alojamiento ${alojamiento} desde el ${fechaInicio.toLocaleDateString()} hasta el ${fechaFin.toLocaleDateString()}, por ${dias} día(s).`;
    }

    destinatario(reserva) {
        return reserva.alojamiento.anfitrion;
    }
}
export class EstadoConfirmada {
    mensaje(reserva) {
        return 'La reserva fue confirmada por el anfitrión'
    }

    destinatario(reserva) {
        return reserva.huespedReservador
    }
}

export class EstadoCancelada {
    mensaje(reserva) {
        const motivo = reserva.motivoCancelacion;

        return `El huésped ha cancelado la reserva. El motivo fue: ${motivo}`
    }

    destinatario(reserva) {
        return reserva.huespedReservador
    }
}