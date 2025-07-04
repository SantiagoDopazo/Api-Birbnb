import { RESERVA_EVENTS } from '../events/ReservaEvents.js';
import { Reserva } from '../models/entities/Reserva.js';
import { FactoryEstadoReserva } from '../models/entities/FactoryEstadoReserva.js';

export class NotificacionListener {
    constructor(notificacionService, alojamientoService) {
        this.notificacionService = notificacionService;
        this.alojamientoService = alojamientoService;
    }

    _convertirReservaAEntidad(reservaMongoDB) {
        const estadoReservaObj = FactoryEstadoReserva.crearDesdeNombre(reservaMongoDB.estadoReserva);
        
        const reservaEntidad = new Reserva(
            reservaMongoDB.huespedReservador,
            reservaMongoDB.cantHuespedes,
            reservaMongoDB.alojamiento,
            reservaMongoDB.rangoFechas,
            reservaMongoDB.precioPorNoche,
            estadoReservaObj
        );
        
        reservaEntidad.id = reservaMongoDB._id;
        
        return reservaEntidad;
    }

    async onReservaCreada(data) {
        const { reserva, alojamientoId } = data;
        
        try {
            const alojamientoCompleto = await this.alojamientoService.findById(alojamientoId);
            const reservaEntidad = this._convertirReservaAEntidad(reserva);
            
            await this.notificacionService.create({
                usuario: alojamientoCompleto.anfitrion.toString(),
                reserva: reservaEntidad.id.toString()
            });
        } catch (error) {
        }
    }

    async onReservaConfirmada(data) {
        const { reserva } = data;
        
        try {
            const reservaEntidad = this._convertirReservaAEntidad(reserva);
            
            await this.notificacionService.create({
                usuario: reservaEntidad.huespedReservador.toString(),
                reserva: reservaEntidad.id.toString()
            });
        } catch (error) {
        }
    }

    async onReservaCancelada(data) {
        const { reserva, alojamientoId } = data;
        
        try {
            const alojamientoCompleto = await this.alojamientoService.findById(alojamientoId);
            const reservaEntidad = this._convertirReservaAEntidad(reserva);
            
            await this.notificacionService.create({
                usuario: alojamientoCompleto.anfitrion.toString(),
                reserva: reservaEntidad.id.toString()
            });
        } catch (error) {
        }
    }

    register(eventManager) {
        eventManager.on(RESERVA_EVENTS.RESERVA_CREADA, this.onReservaCreada.bind(this));
        eventManager.on(RESERVA_EVENTS.RESERVA_CONFIRMADA, this.onReservaConfirmada.bind(this));
        eventManager.on(RESERVA_EVENTS.RESERVA_CANCELADA, this.onReservaCancelada.bind(this));
    }
} 