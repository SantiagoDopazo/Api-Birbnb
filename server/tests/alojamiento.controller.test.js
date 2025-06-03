import { AlojamientoController } from '../app/controllers/alojamientoController';

describe('AlojamientoController', () => {
  let alojamientoService;
  let controller;
  let req;
  let res;
  let next;

  beforeEach(() => {
    alojamientoService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn()
    };

    controller = new AlojamientoController(alojamientoService);

    req = {
      query: {},
      params: {},
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    next = jest.fn();
  });

  test('findAll - debería devolver alojamientos', async () => {
    const mockAlojamientos = [{ nombre: 'Hotel X' }];
    alojamientoService.findAll.mockResolvedValue(mockAlojamientos);

    req.query = { ciudad: 'Buenos Aires', page: 1 };

    await controller.findAll(req, res, next);

    expect(alojamientoService.findAll).toHaveBeenCalledWith({
      precioGt: undefined,
      precioLt: undefined,
      precioGte: undefined,
      precioLte: undefined,
      cantHuespedes: undefined,
      caracteristicas: undefined,
      ciudad: 'Buenos Aires',
      pais: undefined,
      lat: undefined,
      long: undefined,
      page: 1,
      limit: undefined
    });
    expect(res.json).toHaveBeenCalledWith(mockAlojamientos);
  });

  test('findById - debería devolver un alojamiento por ID', async () => {
    const mockAlojamiento = { id: '123', nombre: 'Cabaña' };
    alojamientoService.findById.mockResolvedValue(mockAlojamiento);
    req.params.id = '123';

    await controller.findById(req, res, next);

    expect(alojamientoService.findById).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith(mockAlojamiento);
  });

  test('create - debería crear un nuevo alojamiento', async () => {
    const nuevoAlojamiento = { nombre: 'Nuevo Hotel' };
    alojamientoService.create.mockResolvedValue(nuevoAlojamiento);
    req.body = nuevoAlojamiento;

    await controller.create(req, res, next);

    expect(alojamientoService.create).toHaveBeenCalledWith(nuevoAlojamiento);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nuevoAlojamiento);
  });

  test('delete - debería eliminar un alojamiento por ID', async () => {
    req.params.id = '123';

    await controller.delete(req, res, next);

    expect(alojamientoService.delete).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('update - debería actualizar un alojamiento', async () => {
    const actualizado = { nombre: 'Modificado' };
    alojamientoService.update.mockResolvedValue(actualizado);
    req.params.id = '123';
    req.body = { nombre: 'Modificado' };

    await controller.update(req, res, next);

    expect(alojamientoService.update).toHaveBeenCalledWith('123', { nombre: 'Modificado' });
    expect(res.json).toHaveBeenCalledWith(actualizado);
  });

  test('manejo de errores en findById', async () => {
    const error = new Error('Fallo');
    alojamientoService.findById.mockRejectedValue(error);
    req.params.id = '123';

    await controller.findById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});