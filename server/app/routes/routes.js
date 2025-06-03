import { registerHealthCheckRoutes } from "./healthCheckRoutes.js"
import { registerAlojamientoRoutes } from "./alojamientoRoutes.js"
import { registerNotificacionRoutes } from "./notificacionRoutes.js"
import { registerUsuarioRoutes } from "./usuarioRoutes.js"
import { registerReservaRoutes } from "./reservaRoutes.js";

export function configureRoutes(app, getController) {
    registerHealthCheckRoutes(app, getController);
    registerAlojamientoRoutes(app, getController);
    registerReservaRoutes(app, getController);
    registerNotificacionRoutes(app, getController);
    registerUsuarioRoutes(app, getController);
} 