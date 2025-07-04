export class EstadoPendiente {
    mensaje(reserva) {
        const huesped = reserva.nombreHuesped || reserva.huespedReservador;
        const alojamiento = reserva.nombreAlojamiento || reserva.alojamiento;

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
        const alojamiento = reserva.nombreAlojamiento || reserva.alojamiento;
        const anfitrion = reserva.alojamiento?.anfitrion?.nombre || 'el anfitrión';

        const desde = reserva.rangoFechas.desde;
        const hasta = reserva.rangoFechas.hasta;

        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            throw new Error('Fechas de reserva inválidas');
        }

        const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

        return `¡Excelente! ${anfitrion} ha confirmado tu reserva para "${alojamiento}" del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()} (${dias} día${dias > 1 ? 's' : ''}). ¡Prepárate para una estadía increíble!`;
    }

    destinatario(reserva) {
        return reserva.huespedReservador
    }
}

export class EstadoCancelada {
    mensaje(reserva) {
        const huesped = reserva.nombreHuesped || reserva.huespedReservador?.nombre || 'El huésped';
        const alojamiento = reserva.nombreAlojamiento || reserva.alojamiento?.nombre || 'el alojamiento';
        const motivo = reserva.motivoCancelacion;

        const desde = reserva.rangoFechas.desde;
        const hasta = reserva.rangoFechas.hasta;

        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            throw new Error('Fechas de reserva inválidas');
        }

        const fechaDesde = fechaInicio.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
        const fechaHasta = fechaFin.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });

        return `El huésped ${huesped} ha cancelado su reserva para el ${alojamiento} (${fechaDesde} al ${fechaHasta}). Motivo: ${motivo}`;
    }

    destinatario(reserva) {
        return reserva.alojamiento.anfitrion
    }
}