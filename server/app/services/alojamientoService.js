import { Alojamiento } from "../models/entities/Alojamiento.js"
import { NotFoundError, ValidationError, ValidationErrors, ConflictError } from "../errors/AppError.js";

export class AlojamientoService {
    constructor(alojamientoRepository, usuarioRepository) {
      this.alojamientoRepository = alojamientoRepository
      this.usuarioRepository = usuarioRepository
    }
  

  async findAll(filters = {}, page = 1, limit = 10) {

    this.validarFiltrosBusqueda(filters);

    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const { results, total } = await this.alojamientoRepository.findAll(filters, skip, limit);

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
      await this.validarAlojamiento(alojamiento);

      const { anfitrion, nombre, precioPorNoche, cantHuespedesMax, caracteristicas, direccion } = alojamiento;

      const nuevo = new Alojamiento(anfitrion, nombre, precioPorNoche, cantHuespedesMax, caracteristicas);
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

  validarFiltrosBusqueda(filters) {
    if (!filters || typeof filters !== 'object') {
      throw new ValidationError("Los filtros deben ser un objeto.");
    }

    const errores = [];

    if (estaDefinido(filters.cantHuespedes) && isNaN(Number(filters.cantHuespedes))) {
      errores.push("El filtro 'cantHuespedes' debe ser un número.");
    }

    const precios = ['precioGt', 'precioLt', 'precioGte', 'precioLte'];
    precios.forEach(p => {
      if (estaDefinido(filters[p]) && isNaN(Number(filters[p]))) {
        errores.push(`El filtro '${p}' debe ser un número.`);
      }
    });

    if (estaDefinido(filters.caracteristicas)) {
      const valor = filters.caracteristicas;
      const esArrayValido = Array.isArray(valor) && valor.every(c => typeof c === 'string');
      const esStringValido = typeof valor === 'string';
      if (!esArrayValido && !esStringValido) {
        errores.push("El filtro 'caracteristicas' debe ser un string separado por comas o un array de strings.");
      }
    }

    if (estaDefinido(filters.ciudad) && typeof filters.ciudad !== 'string') {
      errores.push("El filtro 'ciudad' debe ser una cadena de texto.");
    }

    if (estaDefinido(filters.pais) && typeof filters.pais !== 'string') {
      errores.push("El filtro 'pais' debe ser una cadena de texto.");
    }

    if (estaDefinido(filters.lat) && isNaN(Number(filters.lat))) {
      errores.push("El filtro 'lat' debe ser un número.");
    }

    if (estaDefinido(filters.long) && isNaN(Number(filters.long))) {
      errores.push("El filtro 'long' debe ser un número.");
    }

    if (estaDefinido(filters.page) && (isNaN(Number(filters.page)) || Number(filters.page) <= 0)) {
      errores.push("El filtro 'page' debe ser un número mayor que 0.");
    }

    if (estaDefinido(filters.limit) && (isNaN(Number(filters.limit)) || Number(filters.limit) <= 0)) {
      errores.push("El filtro 'limit' debe ser un número mayor que 0.");
    }

    if (errores.length > 0) {
      throw new ValidationErrors("Errores en los filtros", errores);
    }
  }



  async validarAlojamiento(alojamiento) {
    if (!alojamiento) throw new ValidationError("El objeto alojamiento es requerido.");

    const {anfitrion, nombre, precioPorNoche, cantHuespedesMax, caracteristicas, direccion } = alojamiento;

    if (!nombre || typeof nombre !== "string") {
      throw new ValidationError("El campo 'nombre' es requerido y debe ser una cadena de texto.");
    }

    if (typeof precioPorNoche !== "number" || isNaN(precioPorNoche)) {
      throw new ValidationError("El campo 'precioPorNoche' es requerido y debe ser un número.");
    }

    if (typeof cantHuespedesMax !== "number" || isNaN(cantHuespedesMax)) {
      throw new ValidationError("El campo 'cantHuespedesMax' es requerido y debe ser un número.");
    }

    if (!Array.isArray(caracteristicas)) {
      throw new ValidationError("El campo 'caracteristicas' debe ser un array.");
    }

    const caracteristicasInvalidas = caracteristicas.filter(c => typeof c !== "string");
    if (caracteristicasInvalidas.length > 0) {
      throw new ValidationError("Todas las 'caracteristicas' deben ser cadenas de texto.");
    }

    if (!direccion || typeof direccion !== "object") {
      throw new ValidationError("El campo 'direccion' es requerido y debe ser un objeto.");
    }

    if (typeof direccion.calle !== "string") {
      throw new ValidationError("El campo 'direccion.calle' es requerido y debe ser una cadena.");
    }

    if (typeof direccion.altura !== "number" || isNaN(direccion.altura)) {
      throw new ValidationError("El campo 'direccion.altura' es requerido y debe ser un número.");
    }

    if (!direccion.ciudad || typeof direccion.ciudad !== "object") {
      throw new ValidationError("El campo 'direccion.ciudad' es requerido y debe ser un objeto.");
    }

    if (typeof direccion.ciudad.nombre !== "string") {
      throw new ValidationError("El campo 'direccion.ciudad.nombre' es requerido y debe ser una cadena.");
    }

    if (!direccion.ciudad.pais || typeof direccion.ciudad.pais !== "object") {
      throw new ValidationError("El campo 'direccion.ciudad.pais' es requerido y debe ser un objeto.");
    }

    if (typeof direccion.ciudad.pais.nombre !== "string") {
      throw new ValidationError("El campo 'direccion.ciudad.pais.nombre' es requerido y debe ser una cadena.");
    }

    if (typeof direccion.lat !== "number" || isNaN(direccion.lat)) {
      throw new ValidationError("El campo 'direccion.lat' es requerido y debe ser un número.");
    }

    if (typeof direccion.long !== "number" || isNaN(direccion.long)) {
      throw new ValidationError("El campo 'direccion.long' es requerido y debe ser un número.");
    }

    if(!anfitrion){
      throw new ValidationError("El campo 'anfitrion' es requerido");
    }

    if (anfitrion.length != 24) {
      throw new ValidationError("El id ingresado no es válido, recuerde que debe tener 24 caracteres");
    }

    const anfitrionEncontrado = await this.usuarioRepository.findById(anfitrion);
    if (!anfitrionEncontrado) {
      throw new ValidationError("No se encontró un usuario con el id ingresado");
    }
    if (anfitrionEncontrado.tipo != 'ANFITRION') {
      throw new ValidationError("El usuario ingresado no es un anfitrión");
    }

  }

  toDTO(alojamiento) {
      return {
          id: alojamiento.id,
          anfitrion: alojamiento.anfitrion,
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

function estaDefinido(valor) {
  return valor !== undefined && valor !== null && valor !== '';
}
