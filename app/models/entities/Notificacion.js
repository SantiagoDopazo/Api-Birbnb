export class Notificacion {
    fechaLeida

    constructor(mensaje, usuario, reserva) {
        this.mensaje = mensaje
        this.usuario = usuario
        this.reserva = reserva
        this.fechaAlta = new Date()
        this.leida = false
    }

    marcarComoLeida() {
        this.leida = true
        this.fechaLeida = new Date()
    }
}