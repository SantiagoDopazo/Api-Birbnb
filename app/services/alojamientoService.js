import { Alojamiento } from "../models/entities/Alojamiento.js"
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

export class AlojamientoService {
    constructor(alojamientoRepository) {
      this.alojamientoRepository = alojamientoRepository
    }
  
  async findAll(filters = {}) {
      const { results, total, page, limit } = await this.alojamientoRepository.findAll(filters);

      return {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          data: results.map(alojamiento => this.toDTO(alojamiento))
      };
  }


  async findById(id) {
    const alojamiento = await this.alojamientoRepository.findById(id);
    if (!alojamiento) {
      throw new NotFoundError(`alojamiento con id ${id} no encontrado`);
    }
    return this.toDTO(alojamiento);
  }

  async create(alojamiento) {
      const { nombre, precioPorNoche, cantHuespedesMax, caracteristicas, direccion } = alojamiento;

      // Validación básica de campos principales
      if (!nombre || typeof precioPorNoche !== "number" || typeof cantHuespedesMax !== "number" ||
          !Array.isArray(caracteristicas) || !caracteristicas.every(c => typeof c === "string")) {
          throw new ValidationError('Faltan campos requeridos o son inválidos');
      }

      if (!direccion 
          || typeof direccion.calle !== "string"
          || typeof direccion.altura !== "number"
          || !direccion.ciudad
          || typeof direccion.ciudad.nombre !== "string"
          || !direccion.ciudad.pais
          || typeof direccion.ciudad.pais.nombre !== "string"
          || typeof direccion.lat !== "number"
          || typeof direccion.long !== "number"
      ) {
          throw new ValidationError('La dirección es requerida y debe tener todos los campos correctos');
      }

      const existente = await this.alojamientoRepository.findByName(nombre);
      if (existente) {
          throw new ConflictError(`Ya existe un alojamiento con el nombre ${nombre}`);
      }

      const nuevo = new Alojamiento(nombre, precioPorNoche, cantHuespedesMax, caracteristicas);
      nuevo.direccion = direccion;

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
          caracteristicas: alojamiento.caracteristicas,
          direccion: alojamiento.direccion ? {
              calle: alojamiento.direccion.calle,
              altura: alojamiento.direccion.altura,
              ciudad: alojamiento.direccion.ciudad ? {
                  id: alojamiento.direccion.ciudad.id,
                  nombre: alojamiento.direccion.ciudad.nombre,
                  pais: alojamiento.direccion.ciudad.pais ? {
                      id: alojamiento.direccion.ciudad.pais.id,
                      nombre: alojamiento.direccion.ciudad.pais.nombre
                  } : undefined
              } : undefined,
              lat: alojamiento.direccion.lat,
              long: alojamiento.direccion.long
          } : undefined
      };
  }

}
