import { NotificacionModel } from '../schemas/notificacionSchema.js';

export class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

 
    async findAll(filters = {}) {
        const query = {};
        if (filters.usuarioId) {
            query.usuario = filters.usuarioId;
        }
        if (filters.leida !== undefined) {
            if (filters.leida === 'true') {
                query.leida = true;
            } else if (filters.leida === 'false') {
                query.leida = false;
            }
        }
        return await this.model.find(query).populate('usuario');
    }
  
    async findById(id) {
        return await this.model.findById(id).populate('usuario');
    }

    async save(notificacion) {
        const query = notificacion.id ? {_id: notificacion.id} : {_id: new this.model()._id};
        return await this.model.findOneAndUpdate(
            query,
            notificacion,
            { 
                new: true, 
                runValidators: true,
                upsert: true
            }
        );
    }
    async updateById(id, update) {
        return await this.model.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        }).populate('usuario');
    }
}
