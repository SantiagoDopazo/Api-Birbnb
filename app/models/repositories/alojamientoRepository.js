import { AlojamientoModel } from '../schemas/alojamientoSchema.js';

export class AlojamientoRepository {
    constructor() {
        this.model = AlojamientoModel;
    }

 
   async findAll(filters = {}) {
        const query = {};
        if (filters.cantHuespedes) {
            query.cantHuespedesMax = { $gte: Number(filters.cantHuespedes) };
        }
        if (filters.precioGt) {
            query.precioPorNoche = { $gt: Number(filters.precioGt) };
        }
        if (filters.precioLt) {
            query.precioPorNoche = { ...query.precioPorNoche, $lt: Number(filters.precioLt) };
        }
        if (filters.precioGte) {
            query.precioPorNoche = { ...query.precioPorNoche, $gte: Number(filters.precioGte) };
        }
        if (filters.precioLte) {
            query.precioPorNoche = { ...query.precioPorNoche, $lte: Number(filters.precioLte) };
        }
        if (filters.caracteristicas) {
            const caracteristicasArray = Array.isArray(filters.caracteristicas)
                ? filters.caracteristicas
                : filters.caracteristicas.split(',').map(c => c.trim());

            query.caracteristicas = { $all: caracteristicasArray };
        }
        return await this.model.find(query);
    }
  
    async findById(id) {
        return await this.model.findById(id);
    }
  
    async findByName(nombre) {
        return await this.model.findOne({ nombre });
    }
  
    async save(alojamiento) {
        const query = alojamiento.id ? { _id: alojamiento.id } : { _id: new this.model()._id };
        return await this.model.findOneAndUpdate(
            query,
            alojamiento,
            { 
                new: true, 
                runValidators: true,
                upsert: true
            }
        );
    }
  
    async deleteById(id) {
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }

}
