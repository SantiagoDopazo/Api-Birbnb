import { Notificacion } from "../models/entities/Notificacion.js"
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

export class NotificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository;
    this.usuarioRepository = this.usuarioRepository;
  }
  
  async findAll(filters = {}) {
    const notificaciones = await this.notificacionRepository.findAll(filters);
    return notificaciones.map(notificacion => this.toDTO(notificacion));
  }

  async findById(id) {
    const notificacion = await this.notificacionRepository.findById(id);
    if (!notificacion) {
      throw new NotFoundError(`notificacion con id ${id} no encontrado`);
    }
    return this.toDTO(notificacion);
  }

  async marcarComoLeida(id) {
    const notificacion = await this.notificacionRepository.findById(id);
    if (!notificacion) {
      throw new NotFoundError(`notificacion con id ${id} no encontrado`);
    }

    notificacion.leida = true;
    notificacion.fechaLeida = Date.now();
    await notificacion.save();

    return this.toDTO(notificacion);
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