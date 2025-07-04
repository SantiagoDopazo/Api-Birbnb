import { ReservaController } from "../controllers/reservaController.js";

export function registerReservaRoutes(app, getController){
    app.get("/reservas/usuario/:usuarioId", (req, res, next) =>
        getController(ReservaController).findByUsuario(req, res, next)
    );
    app.post("/reservas", (req, res, next) =>
        getController(ReservaController).create(req, res, next)
    );

    app.put("/reservas/:id", (req, res, next) =>
        getController(ReservaController).update(req, res, next)
    );

    app.delete("/reservas/:id", (req, res, next) =>
        getController(ReservaController).delete(req, res, next)
    );

    app.get("/reservas/anfitrion/:anfitrionId", (req, res, next) =>
        getController(ReservaController).findByAnfitrion(req, res, next)
    );
}