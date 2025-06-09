import mongoose from 'mongoose';
import { Reserva } from '../entities/Reserva.js';

const { Schema } = mongoose;

const reservaSchema = new mongoose.Schema({
  huespedReservador: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cantHuespedes: {
    type: Number,
    required: true,
    min: 1
  },
  alojamiento: {
    type: Schema.Types.ObjectId,
    ref: 'Alojamiento',
    required: true
  },
  rangoFechas: {
    desde: {
      type: Date,
      required: true
    },
    hasta: {
      type: Date,
      required: true
    }
  },
  precioPorNoche: {
    type: Number,
    required: true,
    min: 0
  },
  motivoCancelacion: {
    type: String,
    default: null
  },
  estadoReserva: {
    type: String,
    enum: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'],
    required: true
  }
}, {
  timestamps: true,
  collection: 'reservas'
});

reservaSchema.loadClass(Reserva);

export const ReservaModel = mongoose.model('Reserva', reservaSchema);