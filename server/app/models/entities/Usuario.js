export class Usuario {
    nombre
    email
    tipo
    password
    // notificaciones = []

    constructor(nombre, email, tipo, password) {
        this.nombre = nombre
        this.email = email
        this.tipo = tipo
        this.password = password
    }
}