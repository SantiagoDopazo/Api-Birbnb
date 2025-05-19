const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const NotificacionController = require('../controllers/NotificacionController');

// Mock del servicio
const mockService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  marcarComoLeida: jest.fn(),
  create: jest.fn()
};

// Instanciamos app y el controlador
const app = express();
app.use(bodyParser.json());

const controller = new NotificacionController(mockService);

// Rutas simuladas
app.get('/notificaciones', (req, res, next) => controller.findAll(req, res, next));
app.get('/notificaciones/:id', (req, res, next) => controller.findById(req, res, next));
app.put('/notificaciones/:id/marcar-leida', (req, res, next) => controller.marcarComoLeida(req, res, next));
app.post('/notificaciones', (req, res, next) => controller.create(req, res, next));

describe('Notificaciones Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /notificaciones', () => {
    it('debería devolver la lista de notificaciones', async () => {
      const notificacionesMock = [{ id: '1', mensaje: 'Hola', leida: false }];
      mockService.findAll.mockResolvedValue(notificacionesMock);

      const res = await request(app).get('/notificaciones');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(notificacionesMock);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /notificaciones/:id', () => {
    it('debería devolver una notificación por ID', async () => {
      const noti = { id: '1', mensaje: 'Test' };
      mockService.findById.mockResolvedValue(noti);

      const res = await request(app).get('/notificaciones/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(noti);
      expect(mockService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('PUT /notificaciones/:id/marcar-leida', () => {
    it('debería marcar como leída una notificación', async () => {
      const notiLeida = { id: '1', leida: true };
      mockService.marcarComoLeida.mockResolvedValue(notiLeida);

      const res = await request(app).put('/notificaciones/1/marcar-leida');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(notiLeida);
      expect(mockService.marcarComoLeida).toHaveBeenCalledWith('1');
    });
  });

  describe('POST /notificaciones', () => {
    it('debería crear una nueva notificación', async () => {
      const payload = { usuarioId: 'user1', mensaje: 'Nueva noti' };
      const created = { id: '1', ...payload, leida: false, fecha: new Date().toISOString() };
      mockService.create.mockResolvedValue(created);

      const res = await request(app).post('/notificaciones').send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject(payload);
      expect(mockService.create).toHaveBeenCalledWith(payload);
    });
  });
});
