import { AlojamientoService } from '../app/services/alojamientoService.js'
import { Alojamiento } from '../app/models/entities/Alojamiento.js'
import { ValidationError } from '../app/errors/AppError.js'

describe('AlojamientoService - integración', () => {
  let alojamientoService
  let alojamientoRepositoryMock
  let usuarioRepositoryMock

  beforeEach(() => {
    alojamientoRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      deleteById: jest.fn(),
      findIdsByAnfitrion: jest.fn()
    }

    usuarioRepositoryMock = {
      findById: jest.fn()
    }

    alojamientoService = new AlojamientoService(alojamientoRepositoryMock, usuarioRepositoryMock)
  })

  it('crea un alojamiento correctamente', async () => {
    const alojamientoData = {
      anfitrion: '64dbd1f44f1b8a1248a1c3a5',
      nombre: 'Casa en la montaña',
      precioPorNoche: 150,
      cantHuespedesMax: 4,
      caracteristicas: ['wifi', 'calefacción'],
      direccion: {
        calle: 'Los Pinos',
        altura: 123,
        ciudad: {
          nombre: 'Bariloche',
          pais: {
            nombre: 'Argentina'
          }
        },
        lat: -41.1335,
        long: -71.3103
      },
      descripcion: 'Una casa acogedora en la montaña.',
      horarioCheckIn: '14:00',
      horarioCheckOut: '11:00',
      fotos: ['https://example.com/foto1.jpg']
    }

    usuarioRepositoryMock.findById.mockResolvedValue({
      id: alojamientoData.anfitrion,
      tipo: 'ANFITRION'
    })

    const alojamientoGuardado = new Alojamiento(
      alojamientoData.anfitrion,
      alojamientoData.nombre,
      alojamientoData.precioPorNoche,
      alojamientoData.cantHuespedesMax,
      alojamientoData.caracteristicas,
      alojamientoData.descripcion,
      alojamientoData.horarioCheckIn,
      alojamientoData.horarioCheckOut,
      alojamientoData.fotos
    )
    alojamientoGuardado.direccion = alojamientoData.direccion
    alojamientoGuardado.id = 'fake-id-123'

    alojamientoRepositoryMock.save.mockResolvedValue(alojamientoGuardado)

    const result = await alojamientoService.create(alojamientoData)

    expect(result).toEqual({
      id: 'fake-id-123',
      anfitrion: alojamientoData.anfitrion,
      nombre: alojamientoData.nombre,
      descripcion: alojamientoData.descripcion,
      horarioCheckIn: alojamientoData.horarioCheckIn,
      horarioCheckOut: alojamientoData.horarioCheckOut,
      precioPorNoche: alojamientoData.precioPorNoche,
      cantHuespedesMax: alojamientoData.cantHuespedesMax,
      caracteristicas: alojamientoData.caracteristicas,
      fotos: alojamientoData.fotos,
      direccion: {
        calle: alojamientoData.direccion.calle,
        altura: alojamientoData.direccion.altura,
        ciudad: {
          id: undefined,
          nombre: alojamientoData.direccion.ciudad.nombre,
          pais: {
            id: undefined,
            nombre: alojamientoData.direccion.ciudad.pais.nombre
          }
        },
        lat: alojamientoData.direccion.lat,
        long: alojamientoData.direccion.long
      }
    })

    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(alojamientoData.anfitrion)
    expect(alojamientoRepositoryMock.save).toHaveBeenCalled()
  })

  it('lanza error si el anfitrión no existe', async () => {
    const alojamientoData = {
      anfitrion: '64dbd1f44f1b8a1248a1c3a5',
      nombre: 'Casa',
      precioPorNoche: 100,
      cantHuespedesMax: 2,
      caracteristicas: ['wifi'],
      direccion: {
        calle: 'Falsa',
        altura: 123,
        ciudad: {
          nombre: 'Ciudad',
          pais: { nombre: 'Pais' }
        },
        lat: -34,
        long: -58
      },
      descripcion: 'Lugar',
      horarioCheckIn: '14:00',
      horarioCheckOut: '11:00',
      fotos: []
    }

    usuarioRepositoryMock.findById.mockResolvedValue(null)

    await expect(alojamientoService.create(alojamientoData)).rejects.toThrow(ValidationError)
    expect(alojamientoRepositoryMock.save).not.toHaveBeenCalled()
  })
})
