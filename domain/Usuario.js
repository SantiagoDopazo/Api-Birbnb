export class Usuario {
    #nombre
    #email
    #tipo

    constructor(nombre, email, tipo) {
        this.#nombre = nombre
        this.#email = email
        this.#tipo = tipo
    }
}