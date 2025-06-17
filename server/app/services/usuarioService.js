import { Usuario } from "../models/entities/Usuario.js";
import { ValidationError, ConflictError, NotFoundError } from "../errors/AppError.js";

export class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async findAll() {
        const usuarios = await this.usuarioRepository.findAll();
        return usuarios.map(usuario => this.toDTO(usuario));
    }

    async findById(id) {
        const usuario = await this.usuarioRepository.findById(id);
        if (!usuario) {
            throw new NotFoundError(`Usuario con id ${id} no encontrada`);
        }
        return this.toDTO(usuario);
    }

    async findByEmail(email) {
        const usuario = await this.usuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new NotFoundError(`Usuario con email ${email} no encontrado`);
        }
        return usuario;
    }

    async login(email, password) {
        const usuario = await this.usuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new NotFoundError('Usuario no encontrado');
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            throw new UnauthorizedError('Contraseña incorrecta');
        }

        return this.toDTO(usuario);
    }

    async create(usuario) {
        const { nombre, email, tipo, password } = usuario;

        if (!nombre) {
            throw new ValidationError('El nombre del usuario es requerido');
        }
        if (!email) {
            throw new ValidationError('El email del usuario es requerido');
        }
        if (!tipo) {
            throw new ValidationError('El tipo del usuario es requerido');
        }
        if (!password) {
            throw new ValidationError('La contraseña es requerida');
        }

        const existente = await this.usuarioRepository.findByEmail(email);
        if (existente) {
            throw new ConflictError(`Ya existe un usuario con el email ${email}`);
        }

        const nuevo = new Usuario(nombre, email, tipo, password);
        const usuarioGuardado = await this.usuarioRepository.save(nuevo);

        return this.toDTO(usuarioGuardado);
    }

    async delete(id) {
        const deleted = await this.usuarioRepository.deleteById(id);
        if (!deleted) {
            throw new NotFoundError(`Usuario con id ${id} no encontrado`);
        }
        return deleted;
    }

    toDTO(usuario) {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            tipo: usuario.tipo
        };
    }
} 