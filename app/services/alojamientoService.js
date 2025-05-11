import { Alojamiento } from "../models/entities/Alojamiento.js"
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

export class AlojamientoService {
    constructor(alojamientoRepository) {
      this.alojamientoRepository = alojamientoRepository
    }
  
  async findAll(filters = {}) {
    const alojamientos = await this.alojamientoRepository.findAll(filters);
    return alojamientos.map(alojamiento => this.toDTO(alojamiento));
  }

  async findById(id) {
    const alojamiento = await this.alojamientoRepository.findById(id);
    if (!alojamiento) {
      throw new NotFoundError(`alojamiento con id ${id} no encontrado`);
    }
    return this.toDTO(alojamiento);
  }

  async create(alojamiento) {
    //direccion,
    const { nombre, precioPorNoche, cantHuespedesMax, caracteristicas } = alojamiento;

    if (!nombre || typeof precioPorNoche !== "number" || typeof cantHuespedesMax !== "number" || !Array.isArray(caracteristicas) || !caracteristicas.every(c => typeof c === "string")) {
      throw new ValidationError('Faltan campos requeridos o son inválidos');
    }
  
    const existente = await this.alojamientoRepository.findByName(nombre);
    if (existente) {
      throw new ConflictError(`Ya existe un alojamiento con el nombre ${nombre}`);
    }
  
    const nuevo = new Alojamiento( nombre, precioPorNoche, cantHuespedesMax, caracteristicas);

    const alojamientoGuardado = await this.alojamientoRepository.save(nuevo);
    return this.toDTO(alojamientoGuardado);
  }

  async delete(id) {
    const deleted = await this.alojamientoRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError(`alojamiento con id ${id} no encontrado`);
    }
    return deleted;
  }

  toDTO(alojamiento) {
    return {
      id: alojamiento.id,
      nombre: alojamiento.nombre,
      precioPorNoche: alojamiento.precioPorNoche,
      cantHuespedesMax: alojamiento.cantHuespedesMax,
      caracteristicas: alojamiento.caracteristicas
      // direccionCiudad: alojamiento.direccion?.ciudad,
      // direccionPais: alojamiento.direccion?.pais,
      // direccionLat: alojamiento.direccion?.lat,
      // direccionLong: alojamiento.direccion?.long
    };
  }
}
