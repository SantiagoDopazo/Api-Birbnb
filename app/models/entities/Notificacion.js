export class Notificacion {
    fechaLeida

    constructor(mensaje, usuario) {
        this.mensaje = mensaje
        this.usuario = usuario
        this.fechaAlta = new Date()
        this.leida = false
    }

    marcarComoLeida() {
        this.leida = true
        this.fechaLeida = new Date()
    }
}