import { NotificacionController } from "../controllers/notificacionController.js";

export function registerNotificacionRoutes(app, getController) {

  // GET /api/notificaciones?usuarioId=123&leida=false

   app.get("/notificaciones", (req, res, next) =>
    getController(NotificacionController).findAll(req, res, next)
  );

  app.get("/notificaciones/:id", (req, res, next) =>
    getController(NotificacionController).findById(req, res, next)
  );

  app.patch("/notificaciones/:id/marcarLeida", (req, res, next) =>
    getController(NotificacionController).marcarComoLeida(req, res, next)
  );

  app.post("/notificaciones", (req, res, next) =>
    getController(NotificacionController).create(req, res, next)
  );
}