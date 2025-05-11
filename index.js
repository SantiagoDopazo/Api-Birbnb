import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Server } from "./app/server/server.js";
import { MongoDBClient } from "./app/config/database.js";

import { AlojamientoRepository } from "./app/models/repositories/alojamientoRepository.js";
import { AlojamientoService } from "./app/services/alojamientoService.js";
import { AlojamientoController } from "./app/controllers/alojamientoController.js";
import { HealthCheckController } from "./app/controllers/healthCheckController.js";

const app = express();
const port = process.env.PORT || 3000;
const server = new Server(app, port);

MongoDBClient.connect();

const healthCheckController = new HealthCheckController();

const alojamientoRepo = new AlojamientoRepository();
const alojamientoService = new AlojamientoService(alojamientoRepo);
const alojamientoController = new AlojamientoController(alojamientoService);

server.setController(HealthCheckController, healthCheckController);
server.setController(AlojamientoController, alojamientoController);

server.configureRoutes();
server.launch();