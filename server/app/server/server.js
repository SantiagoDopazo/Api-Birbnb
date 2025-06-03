import express from 'express';
import { configureRoutes } from "../routes/routes.js"
import { errorHandler } from "../middlewares/errorHandler.js";

export class Server {
    #controllers = {};
    #app;

    constructor(app, port = 3000) {
        this.#app = app;
        this.port = port;
        this.#app.use(express.json());
    }

    get app() {
        return this.#app;
    }

    setController(controllerClass, controller) {
        this.#controllers[controllerClass.name] = controller;
    }

    getController(controllerClass) {
        const controller = this.#controllers[controllerClass.name];
        if (!controller) {
            throw new Error("Controller missing for the given route.");
        }
        return controller;
    }

    configureRoutes() {
        configureRoutes(this.app, this.getController.bind(this));
        
        this.#app.use((req, res, next) => {
        res.status(404).json({
            status: 'fail',
            message: "La ruta solicitada no existe"
        });
        });

        this.#app.use(errorHandler);
    }

  launch() {
    this.app.listen(this.port, () => {
      console.log("Server running on port " + this.port);
    });
  }
}