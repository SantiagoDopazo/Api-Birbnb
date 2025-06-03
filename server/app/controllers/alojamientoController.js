export class AlojamientoController {
    constructor(alojamientoService) {
        this.alojamientoService = alojamientoService
    }

    async findAll(req, res, next) {
    try {
      const { page = "1", limit = "10", ...filters } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);

      const alojamientos = await this.alojamientoService.findAll(filters, pageNum, limitNum);

      res.json(alojamientos);
    } catch (error) {
      next(error);
    }
  }

    async findById(req, res, next) {
      try {
        const alojamiento = await this.alojamientoService.findById(req.params.id);
        res.json(alojamiento);
      } catch (error) {
        next(error);
      }
    }
  
    async create(req, res, next) {
      try {
        const nuevo = await this.alojamientoService.create(req.body);
        res.status(201).json(nuevo);
      } catch (error) {
        next(error);
      }
    }
  
    async delete(req, res, next) {
      try {
        await this.alojamientoService.delete(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }

    async update(req, res, next) {
      try {
        const actualizado = await this.alojamientoService.update(req.params.id, req.body);
        res.json(actualizado);
      } catch (error) {
        next(error);
      }
    }
}