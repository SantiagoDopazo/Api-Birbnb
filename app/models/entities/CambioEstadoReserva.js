export class CambioEstadoReserva {
    #fecha
    #estado
    #reserva
    #motivo
    #usuario

    constructor(fecha, estado, reserva, motivo, usuario) {
        this.#fecha = fecha
        this.#estado = estado
        this.#reserva = reserva
        this.#motivo = motivo
        this.#usuario = usuario

        this.#reserva.actualizarEstado(this.#estado)
        this.#reserva.motivoCancelacion = motivo

    }
}