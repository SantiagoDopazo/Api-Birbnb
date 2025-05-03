export class Reserva {
    #fechaAlta
    #huespedReservador
    #cantHuespedes
    #alojamiento
    #rangoFechas
    #precioPorNoche
    #motivoCancelacion
    #estadoReserva

    constructor(fechaAlta, huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche, estadoReserva) {
        this.#fechaAlta = fechaAlta
        this.#huespedReservador = huespedReservador
        this.#cantHuespedes = cantHuespedes
        this.#alojamiento = alojamiento
        this.#rangoFechas = rangoFechas
        this.#estadoReserva = estadoReserva
        this.#precioPorNoche = precioPorNoche
    }

    get huespedReservador() {
        return this.#huespedReservador
    }

    get estado() {
        return this.#estadoReserva
    }

    get alojamiento() {
        return this.#alojamiento
    }

    get fechaAlta() {
        return this.#fechaAlta
    }

    get rangoFechas() {
        return this.#rangoFechas;
    }

    get motivoCancelacion() {
        return this.#motivoCancelacion
    }

    set motivoCancelacion(motivo) {
        this.#motivoCancelacion = motivo
    }
    

    actualizarEstado(estadoReserva)
    {
        this.#estadoReserva = estadoReserva
    }

    resumen() {
        return this.#estadoReserva.mensaje(this)
    }

    destinatario() {
        return this.#estadoReserva.destinatario(this)
    }
}