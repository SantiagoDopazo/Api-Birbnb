import { registerHealthCheckRoutes } from "./healthCheckRoutes.js"
import { registerAlojamientoRoutes } from "./alojamientoRoutes.js"

export function configureRoutes(app, getController) {
    registerHealthCheckRoutes(app, getController);
    registerAlojamientoRoutes(app, getController);
} 