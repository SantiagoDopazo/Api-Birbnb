import mongoose from 'mongoose';
import { Usuario } from '../entities/Usuario.js';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['HUESPED', 'ANFITRION'],
        trim: true,
        set: (valor) => valor.trim().toUpperCase()
    }
}, {
    timestamps: true,
    collection: 'usuarios'
});

usuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema); 