import mongoose from 'mongoose';
import { Alojamiento } from '../entities/Alojamiento.js';

const alojamientoSchema = new mongoose.Schema({
    anfitrion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
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
    descripcion: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length >= 3;
            },
            message: 'La descripcion debe tener al menos 3 caracteres'
        }
    },
    horarioCheckIn: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
            },
            message: props => `${props.value} no es un horario válido (HH:mm)`
        }
    },
    horarioCheckOut: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
            },
            message: props => `${props.value} no es un horario válido (HH:mm)`
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

    fotos: {
        type: [String],
        validate: {
            validator: function(arr) {
          
                function esUrlValida(url) {
                    try {
                        new URL(url);
                        return true;
                    } catch {
                        return false;
                    }
                }

                return arr.every(url => typeof url === 'string' && esUrlValida(url));
            },
            message: 'Cada foto debe ser una URL válida.'
        }
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