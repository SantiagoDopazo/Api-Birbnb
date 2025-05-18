import { Reserva } from "../models/entities/Reserva.js";
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

export class ReservaService {
    constructor(reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    async create(reserva) {
        const {
            fechaAlta,
            huespedReservador,
            cantHuespedes,
            alojamiento,
            rangoFechas,
            precioPorNoche,
            estadoReserva
        } = reserva;

        // Validaciones básicas
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

        // Aquí podrías agregar más validaciones, por ejemplo, verificar solapamiento de fechas, etc.

        const nuevaReserva = new Reserva(
            fechaAlta,
            huespedReservador,
            cantHuespedes,
            alojamiento,
            rangoFechas,
            precioPorNoche,
            estadoReserva
        );

        const reservaGuardada = await this.reservaRepository.save(nuevaReserva);
        return this.toDTO(reservaGuardada);
    }

    toDTO(reserva) {
        return {
            // id: reserva.id, // Solo si tienes un getter para id
            fechaAlta: reserva.fechaAlta,
            huespedReservador: reserva.huespedReservador,
            cantHuespedes: reserva.cantHuespedes,
            alojamiento: reserva.alojamiento,
            rangoFechas: reserva.rangoFechas,
            precioPorNoche: reserva.precioPorNoche,
            motivoCancelacion: reserva.motivoCancelacion,
            estadoReserva: reserva.estado // Usar el getter
        };
    }
}