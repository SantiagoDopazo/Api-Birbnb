export class Reserva {
    #fechaAlta
    #huespedReservador
    #cantHuespedes
    #alojamiento
    #rangoFechas
    #estado
    #precioPorNoche
    #motivoCancelacion

    constructor(fechaAlta, huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche) {
        this.#fechaAlta = fechaAlta
        this.#huespedReservador = huespedReservador
        this.#cantHuespedes = cantHuespedes
        this.#alojamiento = alojamiento
        this.#rangoFechas = rangoFechas
        this.#estado = 'PENDIENTE'
        this.#precioPorNoche = precioPorNoche
    }

    get huespedReservador() {
        return this.#huespedReservador
    }

    get estado() {
        return this.#estado
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
        this.#estado = estadoReserva
    }

    resumen() {
        const huesped = this.#huespedReservador;
        const alojamiento = this.#alojamiento;
        const desde = this.#rangoFechas.fechaInicio;
        const hasta = this.#rangoFechas.fechaFin;
    
        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);
        const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    
        return `${huesped} realizó una reserva para el alojamiento ${alojamiento} desde el ${fechaInicio.toLocaleDateString()} hasta el ${fechaFin.toLocaleDateString()}, por ${dias} día(s).;`
    }
}