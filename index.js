import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Server } from "./app/server/server.js";
import { MongoDBClient } from "./app/config/database.js";

import { AlojamientoRepository } from "./app/models/repositories/alojamientoRepository.js";
import { AlojamientoService } from "./app/services/alojamientoService.js";
import { AlojamientoController } from "./app/controllers/alojamientoController.js";

import { NotificacionRepository } from "./app/models/repositories/notificacionRepository.js";
import { NotificacionService } from "./app/services/notificacionService.js";
import { NotificacionController } from "./app/controllers/notificacionController.js";

import { UsuarioRepository } from "./app/models/repositories/usuarioRepository.js";
import { UsuarioService } from "./app/services/usuarioService.js";
import { UsuarioController } from "./app/controllers/usuarioController.js";

import { HealthCheckController } from "./app/controllers/healthCheckController.js";

const app = express();
const port = process.env.PORT || 3000;
const server = new Server(app, port);

MongoDBClient.connect();

const healthCheckController = new HealthCheckController();

const alojamientoRepo = new AlojamientoRepository();
const alojamientoService = new AlojamientoService(alojamientoRepo);
const alojamientoController = new AlojamientoController(alojamientoService);

const notificacionRepo = new NotificacionRepository();
const notificacionService = new NotificacionService(notificacionRepo);
const notificacionController = new NotificacionController(notificacionService);

const usuarioRepo = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepo);
const usuarioController = new UsuarioController(usuarioService);

server.setController(HealthCheckController, healthCheckController);
server.setController(AlojamientoController, alojamientoController);
server.setController(NotificacionController, notificacionController);
server.setController(UsuarioController, usuarioController);

server.configureRoutes();
server.launch();