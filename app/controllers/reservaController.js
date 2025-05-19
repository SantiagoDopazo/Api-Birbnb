export class ReservaController {
    constructor(reservaService) {
        this.reservaService = reservaService
    }

    async findByUsuario(req, res, next) {
        try {
            const reservas = await this.reservaService.findAllByUsuario(req.params.usuarioId);
            res.json(reservas);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next){
        try {
            const nuevaReserva = await this.reservaService.create(req.body);
            res.status(201).json(nuevaReserva);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const reservaActualizada = await this.reservaService.update(req.params.id, req.body);
            res.json(reservaActualizada);
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