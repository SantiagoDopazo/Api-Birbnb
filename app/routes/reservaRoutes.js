import { ReservaController } from "../controllers/reservaController.js";

export function registerReservaRoutes(app, getController){
    app.post("/reservas", (req, res, next) =>
        getController(ReservaController).create(req, res, next)
    );
}