export class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
  
    async findAll(req, res, next) {
        try {
            const usuarios = await this.usuarioService.findAll();
            res.json(usuarios);
        } catch (error) {
            next(error);
        }
    }
  
    async findById(req, res, next) {
        try {
            const usuario = await this.usuarioService.findById(req.params.id);
            res.json(usuario);
        } catch (error) {
            next(error);
        }
    }
  
    async create(req, res, next) {
        try {
            const nuevo = await this.usuarioService.create(req.body);
            res.status(201).json(nuevo);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await this.usuarioService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
} 