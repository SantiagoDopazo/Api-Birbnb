export class Alojamiento {
    id
    descripcion
    moneda
    horarioCheckIn
    horarioCheckOut
    direccion
    reservas = []
    fotos = []

    constructor(anfitrion, nombre, precioPorNoche, cantHuespedesMax, caracteristicas = []) {
        this.anfitrion = anfitrion
        this.nombre = nombre
        this.precioPorNoche = precioPorNoche
        this.cantHuespedesMax = cantHuespedesMax
        this.caracteristicas = caracteristicas
    }

    agregarCaracteristica(carac) {
        this.caracteristicas.push(carac)
    }

    agregarReserva(res) {
        this.reservas.push(res)
    }

    agregarFoto(foto) {
        this.fotos.push(foto)
    }

    estaDisponibleEn(rangoFechas) {
        return this.reservas.every(reserva => {
            return !reserva.rangoFechas.seSuperponeCon(rangoFechas);
        });
    }

    tuPrecioEstaDentroDe(valorMinimo, valorMaximo) {
        return this.precioPorNoche >= valorMinimo && this.precioPorNoche <= valorMaximo
    }

    tenesCaracteristica(caracteristica) {
        return this.caracteristicas.includes(caracteristica);
    }

    puedenAlojarse(cantHuespedes) {
        return this.cantHuespedesMax >= cantHuespedes
    }


}