export class ReservaController {
    constructor(reservaService) {
        this.reservaService = reservaService
    }
    async create(req, res, next){
        try {
            const nuevaReserva = await this.reservaService.create(req.body);
            res.status(201).json(nuevaReserva);
        } catch (error) {
            next(error);
        }
    }
}