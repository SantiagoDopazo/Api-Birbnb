import { UsuarioModel } from '../schemas/usuarioSchema.js';

export class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }
  
    async findAll() {
        const usuarios = await this.model.find();
        return usuarios;
    }
  
    async findById(id) {
        const usuario = await this.model.findById(id);
        return usuario;
    }
  
    async findByEmail(email) {
        const usuario = await this.model.findOne({ email });
        return usuario;
    }
  
    async save(usuario) {
        if (usuario.id) {
            const usuarioActualizado = await this.model.findByIdAndUpdate(
                usuario.id,
                usuario,
                { new: true, runValidators: true }
            );
            return usuarioActualizado;
        } else {
            const nuevoUsuario = new this.model(usuario);
            const usuarioGuardado = await nuevoUsuario.save();
            usuarioGuardado.notificaciones = [];
            return usuarioGuardado;
        }
    }
  
    async deleteById(id) {
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }
} 