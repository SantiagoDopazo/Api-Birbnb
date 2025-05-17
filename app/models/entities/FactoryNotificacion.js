import { Notificacion } from "./Notificacion.js"
export class FactoryNotificacion {

    crearSegunReserva(reserva) {
     
        return new Notificacion(reserva.resumen(), reserva.destinatario(), reserva.fechaAlta);
            
    }
}