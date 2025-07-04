import { Reserva } from "../models/entities/Reserva.js";
import { RangoFechas } from "../models/entities/RangoFechas.js";
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";
import { eventManager } from "../events/EventManager.js";
import { RESERVA_EVENTS } from "../events/ReservaEvents.js";

export class ReservaService {
    constructor(reservaRepository, usuarioService, alojamientoService) {
        this.reservaRepository = reservaRepository;
        this.usuarioService = usuarioService;
        this.alojamientoService = alojamientoService;
    }

    async _validarUsuarioExiste(usuarioId) {
        const usuario = await this.usuarioService.findById(usuarioId);
        if (!usuario) {
            throw new NotFoundError(`Usuario con id ${usuarioId} no existe`);
        }
        return usuario;
    }

    async _validarAlojamientoExiste(alojamientoId) {
        const alojamiento = await this.alojamientoService.findById(alojamientoId);
        if (!alojamiento) {
            throw new NotFoundError(`Alojamiento con id ${alojamientoId} no existe`);
        }
        return alojamiento;
    }

        async _validarReserva(reserva) {
        const { fechaAlta, huespedReservador, cantHuespedes, alojamiento, rangoFechas, precioPorNoche, estadoReserva } = reserva;

        if (
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

        await this._validarUsuarioExiste(huespedReservador);
        await this._validarAlojamientoExiste(alojamiento);
    }

    async _validarDisponibilidadAlojamiento(alojamientoId, rangoFechas) {
        const reservasExistentes = await this.reservaRepository.model.find({
            alojamiento: alojamientoId,
            estadoReserva: { $in: ['PENDIENTE', 'CONFIRMADA'] }
        });

        const nuevoRango = new RangoFechas(
            new Date(rangoFechas.desde),
            new Date(rangoFechas.hasta)
        );

        for (const reservaExistente of reservasExistentes) {
            const rangoExistente = new RangoFechas(
                new Date(reservaExistente.rangoFechas.desde),
                new Date(reservaExistente.rangoFechas.hasta)
            );

            if (nuevoRango.seSuperponeCon(rangoExistente)) {
                const fechaInicioStr = rangoExistente.fechaInicio.toISOString().split('T')[0];
                const fechaFinStr = rangoExistente.fechaFin.toISOString().split('T')[0];
                
                throw new ConflictError(
                    `El alojamiento no está disponible en las fechas seleccionadas. ` +
                    `Conflicto con reserva existente del ${fechaInicioStr} al ${fechaFinStr}.`
                );
                         }
         }
     }

     async _validarDisponibilidadAlojamientoExcluyendo(alojamientoId, rangoFechas, reservaIdExcluir) {
         const reservasExistentes = await this.reservaRepository.model.find({
             _id: { $ne: reservaIdExcluir },
             alojamiento: alojamientoId,
             estadoReserva: { $in: ['PENDIENTE', 'CONFIRMADA'] }
         });

         const nuevoRango = new RangoFechas(
             new Date(rangoFechas.desde),
             new Date(rangoFechas.hasta)
         );

         for (const reservaExistente of reservasExistentes) {
             const rangoExistente = new RangoFechas(
                 new Date(reservaExistente.rangoFechas.desde),
                 new Date(reservaExistente.rangoFechas.hasta)
             );

             if (nuevoRango.seSuperponeCon(rangoExistente)) {
                 const fechaInicioStr = rangoExistente.fechaInicio.toISOString().split('T')[0];
                 const fechaFinStr = rangoExistente.fechaFin.toISOString().split('T')[0];
                 
                 throw new ConflictError(
                     `El alojamiento no está disponible en las nuevas fechas seleccionadas. ` +
                     `Conflicto con reserva existente del ${fechaInicioStr} al ${fechaFinStr}.`
                 );
             }
         }
     }

    //SERVICES

    async findAllByUsuario(usuarioId) {
        await this._validarUsuarioExiste(usuarioId);
        const reservas = await this.reservaRepository.findAllByUsuario(usuarioId);
        return reservas.map(this.toDTO);
    }

    async findAllByAnfitrion(anfitrionId) {
        const alojamientoIds = await this.alojamientoService.findIdsByAnfitrion(anfitrionId);

        if (alojamientoIds.length === 0) {
            return [];
        }

        const reservas = await this.reservaRepository.findByAlojamientoIds(alojamientoIds);

        if (!Array.isArray(reservas)) {
            return [];
        }

        return reservas.map(reserva => this.toDTO(reserva));
    }

    async create(reserva) {
        await this._validarReserva(reserva);
        
        await this._validarDisponibilidadAlojamiento(reserva.alojamiento, reserva.rangoFechas);

        const nuevaReserva = new Reserva(
            reserva.huespedReservador,
            reserva.cantHuespedes,
            reserva.alojamiento,
            reserva.rangoFechas,
            reserva.precioPorNoche,
            reserva.estadoReserva
        );

        const reservaGuardada = await this.reservaRepository.save(nuevaReserva);

        await eventManager.emit(RESERVA_EVENTS.RESERVA_CREADA, {
            reserva: reservaGuardada,
            alojamientoId: reservaGuardada.alojamiento
        });

        return this.toDTO(reservaGuardada);
    }

    async update(id, reserva) {
        await this._validarReserva(reserva);

        const reservaExistente = await this.reservaRepository.model.findById(id);
        if (!reservaExistente) {
            throw new NotFoundError(`reserva con id ${id} no encontrada`);
        }

        const fechaInicio = new Date(reservaExistente.rangoFechas.desde);
        if (Date.now() >= fechaInicio.getTime()) {
            throw new ConflictError("No se puede modificar una reserva en curso o finalizada.");
        }

        const fechasCambiaron = 
            reservaExistente.rangoFechas.desde !== reserva.rangoFechas.desde ||
            reservaExistente.rangoFechas.hasta !== reserva.rangoFechas.hasta;
        const alojamientoCambio = reservaExistente.alojamiento.toString() !== reserva.alojamiento.toString();
        
        if (fechasCambiaron || alojamientoCambio) {
            await this._validarDisponibilidadAlojamientoExcluyendo(
                reserva.alojamiento, 
                reserva.rangoFechas, 
                id
            );
        }
        
        const reservaActualizada = await this.reservaRepository.update(id, reserva);

        if (reservaActualizada && reservaExistente) {
            if (reservaActualizada.estadoReserva === 'CONFIRMADA' && reservaExistente.estadoReserva !== 'CONFIRMADA') {
                await eventManager.emit(RESERVA_EVENTS.RESERVA_CONFIRMADA, {
                    reserva: reservaActualizada
                });
            }
            else if (reservaActualizada.estadoReserva === 'CANCELADA' && reservaExistente.estadoReserva !== 'CANCELADA') {
                await eventManager.emit(RESERVA_EVENTS.RESERVA_CANCELADA, {
                    reserva: reservaActualizada,
                    alojamientoId: reservaActualizada.alojamiento
                });
            }
        }
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
            fechaAlta: reserva.createdAt,
            huespedReservador: reserva.huespedReservador,
            cantHuespedes: reserva.cantHuespedes,
            alojamiento: reserva.alojamiento,
            rangoFechas: reserva.rangoFechas,
            precioPorNoche: reserva.precioPorNoche,
            motivoCancelacion: reserva.motivoCancelacion,
            estadoReserva: reserva.estadoReserva
        };
    }
}