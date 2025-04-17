import { RangoFechas } from "./domain/RangoFechas.js"

export class Alojamiento {
    #anfitrion
    #nombre
    #descripcion
    #precioPorNoche
    #moneda
    #horarioCheckIn
    #horarioCheckOut
    #direccion
    #cantHuespedesMax
    #caracteristicas = []
    #reservas = []
    #fotos = []

    constructor(anfitrion, nombre, descripcion, precioPorNoche, moneda, horarioCheckIn, horarioCheckOut, direccion, cantHuespedesMax) {
        this.#anfitrion = anfitrion
        this.#nombre = nombre
        this.#descripcion = descripcion
        this.#precioPorNoche = precioPorNoche
        this.#moneda = moneda
        this.#horarioCheckIn = horarioCheckIn
        this.#horarioCheckOut = horarioCheckOut
        this.#direccion = direccion
        this.#cantHuespedesMax = cantHuespedesMax
    }

    agregarCaracteristica(carac) {
        this.#caracteristicas.push(carac)
    }

    agregarReserva(res) {
        this.#reservas.push(res)
    }

    agregarFoto(foto) {
        this.#fotos.push(foto)
    }

    estaDisponibleEn(rangoFechas) {
        return this.#reservas.every(reserva => {
            return !reserva.rangoFechas.seSuperponeCon(rangoFechas);
        });
    }

    tuPrecioEstaDentroDe(valorMinimo, valorMaximo) {
        return this.#precioPorNoche >= valorMinimo && this.#precioPorNoche <= valorMaximo
    }

    tenesCaracteristica(caracteristica) {
        return this.#caracteristicas.includes(caracteristica);
    }

    puedenAlojarse(cantHuespedes) {
        return this.#cantHuespedesMax >= cantHuespedes
    }


}