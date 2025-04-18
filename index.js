import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Server } from "./server.js";

import { HealthCheckController } from "./app/controllers/healthCheckController.js";

const app = express();
const port = process.env.PORT || 3000;
const server = new Server(app, port);

const healthCheckController = new HealthCheckController();

server.setController(HealthCheckController, healthCheckController);

server.configureRoutes();
server.launch();