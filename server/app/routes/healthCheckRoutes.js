import { HealthCheckController } from "../controllers/healthCheckController.js";

export function registerHealthCheckRoutes(app, getController) {

    app.get("/health_check", (req, res) => {
        getController(HealthCheckController).check(req, res);
    });

}