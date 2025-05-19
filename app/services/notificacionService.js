import { Notificacion } from "../models/entities/Notificacion.js"
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";
import { FactoryNotificacion } from "../models/entities/FactoryNotificacion.js";

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

  async create(notificacion) {
      const { mensaje, usuario, reserva } = notificacion;

      if (!mensaje || !usuario || !reserva) {
          throw new ValidationError('Faltan campos requeridos o son inválidos');
      }

      const existente = await this.notificacionRepository.findByMensaje(mensaje, usuario.id);
      if (existente) {
          throw new ConflictError(`Ya existe una notificacion con el mensaje ${mensaje} para ese usuario`);
      }

      const factoryNotificacion = new FactoryNotificacion();
      const nuevo = factoryNotificacion.crearSegunReserva(reserva);

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