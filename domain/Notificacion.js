export class Notificacion {
    #mensaje
    #usuario
    #fechaAlta
    #leida
    #fechaLeida

    constructor(mensaje, usuario, fechaAlta) {
        this.#mensaje = mensaje
        this.#usuario = usuario
        this.#fechaAlta = fechaAlta
        this.#leida = false
    }

    marcarComoLeida() {
        this.#leida = true
        this.#fechaLeida = new Date()
    }

}