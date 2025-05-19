import { Reserva } from "../models/entities/Reserva.js";
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

export class ReservaService {
    constructor(reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    async findAllByUsuario(usuarioId) {
        const reservas = await this.reservaRepository.findAllByUsuario(usuarioId);
        return reservas.map(this.toDTO);
    }

    async create(reserva) {
        validarReserva(reserva);

        const nuevaReserva = new Reserva(
            reserva.fechaAlta,
            reserva.huespedReservador,
            reserva.cantHuespedes,
            reserva.alojamiento,
            reserva.rangoFechas,
            reserva.precioPorNoche,
            reserva.estadoReserva
        );

        const reservaGuardada = await this.reservaRepository.save(nuevaReserva);
        return this.toDTO(reservaGuardada);
    }

    async update(id, reserva) {
        validarReserva(reserva);

        const reservaExistente = await this.reservaRepository.model.findById(id);
        if (!reservaExistente) {
            throw new NotFoundError(`reserva con id ${id} no encontrada`);
        }

        const fechaInicio = new Date(reservaExistente.rangoFechas.desde);
        if (Date.now() >= fechaInicio.getTime()) {
            throw new ConflictError("No se puede modificar una reserva en curso o finalizada.");
        }

        
        const reservaActualizada = await this.reservaRepository.update(id, reserva);
        return this.toDTO(reservaActualizada);
    }

    async delete(id) {
        const reserva = await this.reservaRepository.model.findById(id);

        if (!reserva) {
            throw new NotFoundError(`reserva con id ${id} no encontrada`);
        }

        const fechaInicio = new Date(reserva.rangoFechas.desde);
        if (Date.now() >= fechaInicio.getTime()) {
            throw new ConflictError("No se puede cancelar una reserva en curso o finalizada.");
        }
  
        const deleted = await this.reservaRepository.deleteById(id);
        return deleted;
    }

    toDTO(reserva) {
        return {
            id: reserva._id,
            fechaAlta: reserva.fechaAlta,
            huespedReservador: reserva.huespedReservador,
            cantHuespedes: reserva.cantHuespedes,
            alojamiento: reserva.alojamiento,
            rangoFechas: reserva.rangoFechas,
            precioPorNoche: reserva.precioPorNoche,
            motivoCancelacion: reserva.motivoCancelacion,
            estadoReserva: reserva.estado
        };
    }
}

function validarReserva({ fechaAlta, huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche, estadoReserva }) {
    if (
        !fechaAlta ||
        !huespedReservador ||
        !alojamiento ||
        !rangoFechas ||
        !rangoFechas.desde ||
        !rangoFechas.hasta ||
        typeof cantHuespedes !== "number" ||
        typeof precioPorNoche !== "number" ||
        !estadoReserva
    ) {
        throw new ValidationError("Faltan campos requeridos o son inválidos");
    }

    if (cantHuespedes < 1) {
        throw new ValidationError("La cantidad de huéspedes debe ser al menos 1");
    }

    if (precioPorNoche < 0) {
        throw new ValidationError("El precio por noche debe ser mayor o igual a 0");
    }

    const desde = new Date(rangoFechas.desde);
    const hasta = new Date(rangoFechas.hasta);

    if (isNaN(desde) || isNaN(hasta)) {
        throw new ValidationError("Las fechas enviadas no son válidas");
    }

    if (desde > hasta) {
        throw new ValidationError("La fecha desde no puede ser mayor que la fecha hasta");
    }
}