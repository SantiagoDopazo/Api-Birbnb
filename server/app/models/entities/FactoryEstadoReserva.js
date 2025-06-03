import { EstadoPendiente, EstadoConfirmada, EstadoCancelada } from "./EstadoReserva.js";

export class FactoryEstadoReserva {
  static crearDesdeNombre(nombre) {
    const estado = nombre.toLowerCase();
    switch(estado) {
      case 'pendiente':
        return new EstadoPendiente();
      case 'confirmada':
        return new EstadoConfirmada();
      case 'cancelada':
        return new EstadoCancelada();
      default:
        throw new Error(`Estado de reserva desconocido: ${nombre}`);
    }
  }
}