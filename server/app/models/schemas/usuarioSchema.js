import mongoose from 'mongoose';
import { Usuario } from '../entities/Usuario.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios']
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
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    collection: 'usuarios'
});

usuarioSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
    next();
});

usuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema); 