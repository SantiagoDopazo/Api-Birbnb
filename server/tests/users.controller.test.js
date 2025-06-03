import { UsuarioController } from '../app/controllers/usuarioController';

describe('UsuarioController', () => {
  let usuarioService;
  let controller;
  let req;
  let res;
  let next;

  beforeEach(() => {
    usuarioService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    };

    controller = new UsuarioController(usuarioService);

    req = {
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

  test('findAll - debería devolver todos los usuarios', async () => {
    const mockUsuarios = [{ nombre: 'Juan' }];
    usuarioService.findAll.mockResolvedValue(mockUsuarios);

    await controller.findAll(req, res, next);

    expect(usuarioService.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockUsuarios);
  });

  test('findAll - debería llamar a next con error si falla', async () => {
    const error = new Error('Fallo findAll');
    usuarioService.findAll.mockRejectedValue(error);

    await controller.findAll(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('findById - debería devolver un usuario por ID', async () => {
    const mockUsuario = { id: '123', nombre: 'Ana' };
    usuarioService.findById.mockResolvedValue(mockUsuario);
    req.params.id = '123';

    await controller.findById(req, res, next);

    expect(usuarioService.findById).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith(mockUsuario);
  });

  test('findById - debería llamar a next con error si falla', async () => {
    const error = new Error('Fallo findById');
    usuarioService.findById.mockRejectedValue(error);
    req.params.id = '123';

    await controller.findById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('create - debería crear un nuevo usuario', async () => {
    const nuevoUsuario = { nombre: 'Pedro' };
    usuarioService.create.mockResolvedValue(nuevoUsuario);
    req.body = nuevoUsuario;

    await controller.create(req, res, next);

    expect(usuarioService.create).toHaveBeenCalledWith(nuevoUsuario);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nuevoUsuario);
  });

  test('create - debería llamar a next con error si falla', async () => {
    const error = new Error('Fallo create');
    usuarioService.create.mockRejectedValue(error);
    req.body = { nombre: 'Pedro' };

    await controller.create(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  test('delete - debería eliminar un usuario por ID', async () => {
    req.params.id = '123';

    await controller.delete(req, res, next);

    expect(usuarioService.delete).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test('delete - debería llamar a next con error si falla', async () => {
    const error = new Error('Fallo delete');
    usuarioService.delete.mockRejectedValue(error);
    req.params.id = '123';

    await controller.delete(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
