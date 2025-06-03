import { ReservaController } from '../app/controllers/reservaController';

describe('ReservaController', () => {
  let reservaServiceMock;
  let controller;
  let req;
  let res;
  let next;

  beforeEach(() => {
    reservaServiceMock = {
      findAllByUsuario: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new ReservaController(reservaServiceMock);

    req = { params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('findByUsuario', () => {
    it('debería devolver las reservas de un usuario', async () => {
      const mockReservas = [{ id: 1 }, { id: 2 }];
      reservaServiceMock.findAllByUsuario.mockResolvedValue(mockReservas);

      req.params.usuarioId = '123';
      await controller.findByUsuario(req, res, next);

      expect(reservaServiceMock.findAllByUsuario).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockReservas);
    });

    it('debería llamar a next en caso de error', async () => {
      const error = new Error('Error');
      reservaServiceMock.findAllByUsuario.mockRejectedValue(error);

      await controller.findByUsuario(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('debería crear una nueva reserva y devolverla', async () => {
      const mockReserva = { id: 1, nombre: 'Reserva' };
      reservaServiceMock.create.mockResolvedValue(mockReserva);

      req.body = { nombre: 'Reserva' };
      await controller.create(req, res, next);

      expect(reservaServiceMock.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockReserva);
    });

    it('debería manejar errores con next', async () => {
      const error = new Error('Error');
      reservaServiceMock.create.mockRejectedValue(error);

      await controller.create(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('debería actualizar una reserva', async () => {
      const mockReserva = { id: 1, nombre: 'Actualizado' };
      reservaServiceMock.update.mockResolvedValue(mockReserva);

      req.params.id = '1';
      req.body = { nombre: 'Actualizado' };

      await controller.update(req, res, next);

      expect(reservaServiceMock.update).toHaveBeenCalledWith('1', req.body);
      expect(res.json).toHaveBeenCalledWith(mockReserva);
    });

    it('debería manejar errores con next', async () => {
      const error = new Error('Error');
      reservaServiceMock.update.mockRejectedValue(error);

      await controller.update(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('debería eliminar una reserva y devolver 204', async () => {
      reservaServiceMock.delete.mockResolvedValue();

      req.params.id = '1';
      await controller.delete(req, res, next);

      expect(reservaServiceMock.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('debería manejar errores con next', async () => {
      const error = new Error('Error');
      reservaServiceMock.delete.mockRejectedValue(error);

      await controller.delete(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});