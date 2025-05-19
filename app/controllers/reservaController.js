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

    async delete(req, res, next) {
        try {
            await this.reservaService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}