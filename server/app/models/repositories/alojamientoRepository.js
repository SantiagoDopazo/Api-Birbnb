import { AlojamientoModel } from '../schemas/alojamientoSchema.js';

export class AlojamientoRepository {
    constructor() {
        this.model = AlojamientoModel;
    }

    async findAll(filters = {}, skip = 0, limit = 10) {
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
    if (filters.ciudad) {
      query['direccion.ciudad.nombre'] = { $regex: `^${filters.ciudad}$`, $options: 'i' };
    }
    if (filters.pais) {
      query['direccion.ciudad.pais.nombre'] = { $regex: `^${filters.pais}$`, $options: 'i' };
    }
    if (filters.lat) {
      query['direccion.lat'] = Number(filters.lat);
    }
    if (filters.long) {
      query['direccion.long'] = Number(filters.long);
    }

    const total = await this.model.countDocuments(query);
    const results = await this.model.find(query).skip(skip).limit(limit);

    return { results, total };
  }
 
    async findById(id) {
        return await this.model.findById(id);
    }
  
    async findByName(nombre) {
        return await this.model.findOne({ nombre });
    }
  
    async save(alojamiento) {

      const data = {
        anfitrion: alojamiento.anfitrion,
        nombre: alojamiento.nombre,
        descripcion: alojamiento.descripcion,
        horarioCheckIn: alojamiento.horarioCheckIn,
        horarioCheckOut: alojamiento.horarioCheckOut,
        precioPorNoche: alojamiento.precioPorNoche,
        cantHuespedesMax: alojamiento.cantHuespedesMax,
        caracteristicas: alojamiento.caracteristicas,
        fotos: alojamiento.fotos,
        direccion: alojamiento.direccion
      };

      if (alojamiento.id) {
        return await this.model.findByIdAndUpdate(
          alojamiento.id,
          data,
          { new: true, runValidators: true }
        );
      } else {
        const nuevo = new this.model(data);
        return await nuevo.save();
      }
    }
  
    async deleteById(id) {
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }

}
