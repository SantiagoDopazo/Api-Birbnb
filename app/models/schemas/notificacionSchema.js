import mongoose from 'mongoose';
import { Notificacion } from '../entities/Notificacion.js';

const notificacionSchema = new mongoose.Schema({
    mensaje: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 3;
            },
            message: 'El mensaje debe tener al menos 3 caracteres'
        }
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaAlta: {
        type: Date,
        required: true
    },
    leida: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema); 