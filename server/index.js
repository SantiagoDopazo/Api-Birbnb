import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import express from "express";
import { Server } from "./app/server/server.js";
import { MongoDBClient } from "./app/config/database.js";

import { AlojamientoRepository } from "./app/models/repositories/alojamientoRepository.js";
import { AlojamientoService } from "./app/services/alojamientoService.js";
import { AlojamientoController } from "./app/controllers/alojamientoController.js";

import { ReservaRepository } from "./app/models/repositories/reservaRepository.js";
import { ReservaService } from "./app/services/reservaService.js";
import { ReservaController } from "./app/controllers/reservaController.js";

import { NotificacionRepository } from "./app/models/repositories/notificacionRepository.js";
import { NotificacionService } from "./app/services/notificacionService.js";
import { NotificacionController } from "./app/controllers/notificacionController.js";

import { UsuarioRepository } from "./app/models/repositories/usuarioRepository.js";
import { UsuarioService } from "./app/services/usuarioService.js";
import { UsuarioController } from "./app/controllers/usuarioController.js";

import { HealthCheckController } from "./app/controllers/healthCheckController.js";

import { eventManager } from "./app/events/EventManager.js";
import { NotificacionListener } from "./app/listeners/NotificacionListener.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001'
}));


const server = new Server(app, port);


MongoDBClient.connect();

const healthCheckController = new HealthCheckController();

const usuarioRepo = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepo);

const alojamientoRepo = new AlojamientoRepository();
const alojamientoService = new AlojamientoService(alojamientoRepo, usuarioRepo);

const reservaRepo = new ReservaRepository();
const notificacionRepo = new NotificacionRepository();

const reservaService = new ReservaService(reservaRepo, usuarioService, alojamientoService);
const notificacionService = new NotificacionService(notificacionRepo, reservaRepo, usuarioRepo);

const notificacionListener = new NotificacionListener(notificacionService, alojamientoService);
notificacionListener.register(eventManager);

const usuarioController = new UsuarioController(usuarioService);
const alojamientoController = new AlojamientoController(alojamientoService);
const reservaController = new ReservaController(reservaService);
const notificacionController = new NotificacionController(notificacionService);


server.setController(HealthCheckController, healthCheckController);
server.setController(AlojamientoController, alojamientoController);
server.setController(NotificacionController, notificacionController);
server.setController(UsuarioController, usuarioController);
server.setController(ReservaController, reservaController)

server.configureRoutes();

server.launch();