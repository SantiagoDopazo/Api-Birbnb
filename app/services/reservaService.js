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

        const reservaSolapada = await this.reservaRepository.model.findOne({
            alojamiento: alojamiento,
            $or: [
                {
                    "rangoFechas.desde": { $lte: hasta },
                    "rangoFechas.hasta": { $gte: desde }
                }
            ],
            estadoReserva: { $ne: "CANCELADA" }
        });

    if (reservaSolapada) {
        throw new ConflictError("Ya existe una reserva para este alojamiento en el rango de fechas seleccionado.");
    }
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