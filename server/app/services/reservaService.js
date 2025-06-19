import { Reserva } from "../models/entities/Reserva.js";
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

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

    //SERVICES

    async findAllByUsuario(usuarioId) {
        await this._validarUsuarioExiste(usuarioId);
        const reservas = await this.reservaRepository.findAllByUsuario(usuarioId);
        return reservas.map(this.toDTO);
    }

    async create(reserva) {
        await this._validarReserva(reserva);

        const nuevaReserva = new Reserva(
            reserva.huespedReservador,
            reserva.cantHuespedes,
            reserva.alojamiento,
            reserva.rangoFechas,
            reserva.precioPorNoche,
            reserva.estadoReserva
        );

        const reservaGuardada = await this.reservaRepository.save(nuevaReserva);
        const alojamientoCompleto = await this.alojamientoService.findById(reservaGuardada.alojamiento);

        /* await this.notificacionService.create({
            usuario: alojamientoCompleto.anfitrion.toString(),
            reserva: reservaGuardada._id.toString()
        }); */

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

        
        const reservaActualizada = await this.reservaRepository.update(id, reserva);

        if (reservaActualizada && reservaExistente) {
            if (reservaActualizada.estadoReserva === 'CONFIRMADA' && reservaExistente.estadoReserva !== 'CONFIRMADA') {
                await this.notificacionService.create({
                    usuario: reservaActualizada.huespedReservador.id.toString(),
                    reserva: reservaActualizada._id.toString()
                });
            }

            else if (reservaActualizada.estadoReserva === 'CANCELADA' && reservaExistente.estadoReserva !== 'CANCELADA') {
                await this.notificacionService.create({
                    usuario: reservaActualizada.alojamiento.anfitrion.id.toString(),
                    reserva: reservaActualizada._id.toString()
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