import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";
import { FactoryNotificacion } from "../models/entities/FactoryNotificacion.js";
import { FactoryEstadoReserva } from "../models/entities/FactoryEstadoReserva.js";
import { Reserva } from "../models/entities/Reserva.js"

export class NotificacionService {
  constructor(notificacionRepository, reservaRepository, usuarioRepository) {
    this.notificacionRepository = notificacionRepository;
    this.reservaRepository = reservaRepository;
    this.usuarioRepository = usuarioRepository;
  }
  
  async findAll(filters = {}) { 
    const {usuarioId} = filters
    await this.validarUsuario(usuarioId);

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

  notificacion.marcarComoLeida();
  const notificacionGuardada = await this.notificacionRepository.save(notificacion);

  return this.toDTO(notificacionGuardada);
}

  async create(notificacion) {
      const { usuario, reserva } = notificacion;
      this.validarUsuario(usuario);

      if (!usuario || !reserva) {
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

 async validarUsuario(usuario){
    if (!usuario || String(usuario).length !== 24) {
      throw new ValidationError("El id ingresado no es válido, recuerde que debe tener 24 caracteres");
    }

    const usuarioObtenido = await this.usuarioRepository.findById(usuario);
    
    if(!usuarioObtenido){
      throw new ValidationError('El usuario ingresado no es válido')
    }

  }
}