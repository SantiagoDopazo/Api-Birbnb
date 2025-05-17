export class NotificacionController {
    constructor(notificacionService) {
        this.notificacionService = notificacionService
    }

    async findAll(req, res, next) {
      try {
        const filters = {
          usuarioId: req.query.usuarioId,
          leida: req.query.leida,
        };
        const notificaciones = await this.notificacionService.findAll(filters);
        res.json(notificaciones);
      } catch (error) {
        next(error);
      }
    }

    async findById(req, res, next) {
      try {
        const notificacion = await this.notificacionService.findById(req.params.id);
        res.json(notificacion);
      } catch (error) {
        next(error);
      }
    }

    async marcarComoLeida(req, res, next) {
      try {
        const notificacion = await this.notificacionService.marcarComoLeida(req.params.id);
        res.json(notificacion);
      } catch (error) {
        next(error);
      }
    }
}