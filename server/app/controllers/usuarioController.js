import bcrypt from 'bcrypt';
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

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const usuario = await this.usuarioService.usuarioRepository.findByEmail(email);
            if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            const usuarioDTO = this.usuarioService.toDTO(usuario);
            res.json(usuarioDTO);
        } catch (error) {
            next(error);
        }
    }
} 