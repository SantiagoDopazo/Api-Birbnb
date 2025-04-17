export class Reserva {
    #fechaAlta
    #huespedReservador
    #cantHuespedes
    #alojamiento
    #rangoFechas
    #estado
    #precioPorNoche

    constructor(fechaAlta, huespedReservador, cantHuespedes, alojamiento, rangoFechas, estado, precioPorNoche) {
        this.#fechaAlta = fechaAlta
        this.#huespedReservador = huespedReservador
        this.#cantHuespedes = cantHuespedes
        this.#alojamiento = alojamiento
        this.#rangoFechas = rangoFechas
        this.#estado = estado
        this.#precioPorNoche = precioPorNoche
    }

    get huespedReservador() {
        return this.#huespedReservador
    }

    get fechaAlta() {
        return this.#fechaAlta
    }

    get rangoFechas() {
        return this.#rangoFechas;
    }
    

    actualizarEstado(estadoReserva)
    {
        this.#estado = estadoReserva
    }
}