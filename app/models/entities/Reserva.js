export class Reserva {
    id
    fechaAlta
    huespedReservador
    cantHuespedes
    alojamiento
    rangoFechas
    precioPorNoche
    motivoCancelacion
    estadoReserva

    constructor(fechaAlta, huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche, estadoReserva) {
        this.fechaAlta = fechaAlta
        this.huespedReservador = huespedReservador
        this.cantHuespedes = cantHuespedes
        this.alojamiento = alojamiento
        this.rangoFechas = rangoFechas
        this.estadoReserva = estadoReserva
        this.precioPorNoche = precioPorNoche
    }

    actualizarEstado(estadoReserva)
    {
        this.estadoReserva = estadoReserva
    }

    resumen() {
        return this.estadoReserva.mensaje(this)
    }

    destinatario() {
        return this.estadoReserva.destinatario(this)
    }
}