import mongoose from 'mongoose';
import { Alojamiento } from '../entities/Alojamiento.js';

const alojamientoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length >= 3;
            },
            message: 'El nombre debe tener al menos 3 caracteres'
        }
    },
    precioPorNoche: {
        type: Number,
        required: true,
        min: 0
    },
    cantHuespedesMax: {
        type: Number,
        required: true,
        min: 0
    },
    caracteristicas: {
        type: [String]
    },
    
    direccion: {
        calle: { type: String, required: true, trim: true },
        altura: { type: Number, required: true, min: 0 },
        ciudad: {
            nombre: { type: String, required: true },
            pais: {
                nombre: { type: String, required: true }
            }
        },
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    }
}, {
    timestamps: true
});

alojamientoSchema.loadClass(Alojamiento);

export const AlojamientoModel = mongoose.model('Alojamiento', alojamientoSchema); 