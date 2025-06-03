import { Notificacion } from "./Notificacion.js"
export class FactoryNotificacion {

    crearSegunReserva(reserva, reservaId) {
     
        return new Notificacion(reserva.resumen(), reserva.destinatario(), reservaId);
            
    }
}