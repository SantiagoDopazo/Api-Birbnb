import { ReservaModel } from "../schemas/reservaSchema.js";

export class ReservaRepository {
    constructor() {
        this.model = ReservaModel;
    }

    async findAllByUsuario(usuarioId) {
        return await this.model.find({ huespedReservador: usuarioId });
    }

    async save(reserva) {
        const query = reserva.id ? {_id: reserva.id} : {_id: new this.model()._id};
        return await this.model.findOneAndUpdate(
            query,
            reserva,
            { 
                new: true, 
                runValidators: true,
                upsert: true
            }
        );
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findByAlojamientoIds(alojamientoIds) {
        return await this.model.find({ alojamiento: { $in: alojamientoIds } });
    }

    async deleteById(id) {
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }
}