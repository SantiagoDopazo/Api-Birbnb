import express from 'express';
import { healthCheckRoutes } from './app/routes/healthCheckRoutes.js';

export class Server {
    #controllers = {};
    #app;

    constructor(app, port = 3000) {
        this.#app = express();
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
        healthCheckRoutes(this.app, this.getController.bind(this));
    }

    launch() {
        this.app.listen(this.port, () => {
            console.log(`Server running on: http://localhost:${this.port}`);
        });
    }
}