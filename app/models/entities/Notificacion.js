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

    get leida() {
        return this.#leida
    }

    get fechaLeida() {
        return this.#fechaLeida
    }

    marcarComoLeida() {
        this.#leida = true
        this.#fechaLeida = new Date()
    }

}