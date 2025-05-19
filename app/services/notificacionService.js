import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";
import { FactoryNotificacion } from "../models/entities/FactoryNotificacion.js";
import { FactoryEstadoReserva } from "../models/entities/FactoryEstadoReserva.js";
import { Reserva } from "../models/entities/Reserva.js"

export class NotificacionService {
  constructor(notificacionRepository, reservaRepository) {
    this.notificacionRepository = notificacionRepository;
    this.reservaRepository = reservaRepository;
  }
  
  async findAll(filters = {}) {
    const notificaciones = await this.notificacionRepository.findAll(filters);
    return notificaciones.map(notificacion => this.toDTO(notificacion));
  }

  async findById(id) {
    const notificacion = await this.notificacionRepository.findById(id);
    if (!notificacion) {
      throw new NotFoundError(`Notificacion con id ${id} no encontrada`);
    }
    return this.toDTO(notificacion);
  }

async marcarComoLeida(id) {
  const notificacion = await this.notificacionRepository.findById(id);
  if (!notificacion) {
    throw new NotFoundError(`Notificación con id ${id} no encontrada`);
  }

  const actualizado = await this.notificacionRepository.updateById(id, {
    leida: true,
    fechaLeida: new Date()
  });

  return this.toDTO(actualizado);
}

  async create(notificacion) {
      const { mensaje, usuario, reserva } = notificacion;

      if (!mensaje || !usuario || !reserva) {
          throw new ValidationError('Faltan campos requeridos o son inválidos');
      }

      const usuarioId = usuario.id || usuario;
      const reservaId = reserva.id || reserva;

      const reservaCompleta = await this.reservaRepository.findById(reservaId);
      if (!reservaCompleta) {
          throw new NotFoundError('Reserva no encontrada');
      }

      const estado = FactoryEstadoReserva.crearDesdeNombre(reservaCompleta.estadoReserva);

      const reservaNueva = new Reserva(
        reservaCompleta.fechaAlta,
        reservaCompleta.huespedReservador,
        reservaCompleta.cantHuespedes,
        reservaCompleta.alojamiento,
        reservaCompleta.rangoFechas,
        reservaCompleta.precioPorNoche,
        estado
      );

      const factoryNotificacion = new FactoryNotificacion();
      const nuevo = factoryNotificacion.crearSegunReserva(reservaNueva, reservaId);
      nuevo.usuario = usuarioId;

      const notificacionGuardada = await this.notificacionRepository.save(nuevo);
      return this.toDTO(notificacionGuardada);
  }

  toDTO(notificacion) {
    return {
      id: notificacion.id,
      mensaje: notificacion.mensaje,
      usuario: notificacion.usuario,
      fechaAlta: notificacion.fechaAlta,
      leida: notificacion.leida
    };
  }
}