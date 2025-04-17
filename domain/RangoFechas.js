export class RangoFechas {
    #fechaInicio
    #fechaFin

    constructor(fechaInicio, fechaFin){
        this.#fechaInicio = fechaInicio
        this.#fechaFin = fechaFin
    }

    seSuperponeCon(otroRango) {
        return this.#fechaInicio <= otroRango.fechaFin && this.#fechaFin >= otroRango.fechaInicio;
    }

    get fechaInicio() {
        return this.#fechaInicio
    }

    get fechaFin() {
        return this.#fechaFin
    }
}