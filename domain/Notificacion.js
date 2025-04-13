export class Notificacion {
    #mensaje
    #usuario
    #fechaAlta
    #leida
    #fechaLeida

    constructor(mensaje, usuario, fechaAlta, leida, fechaLeida) {
        this.#mensaje = mensaje
        this.#usuario = usuario
        this.#fechaAlta = fechaAlta
        this.#leida = leida
        this.#fechaLeida = fechaLeida
    }
}