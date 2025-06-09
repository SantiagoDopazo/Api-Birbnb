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

    constructor(huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche, estadoReserva) {
        this.huespedReservador = huespedReservador
        this.cantHuespedes = cantHuespedes
        this.alojamiento = alojamiento
        this.rangoFechas = rangoFechas
        this.precioPorNoche = precioPorNoche
        this.estadoReserva = estadoReserva
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