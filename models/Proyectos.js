import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';

export class Proyecto {
    constructor(clienteId, propuestaId, descripcion, valor, fechaInicio, estado, avances = [], contratoId = null) {
        if (!clienteId || !propuestaId || !descripcion || !valor || !fechaInicio || !estado) {
            throw new Error("Todos los campos obligatorios del proyecto deben ser proporcionados.");
        }

        this.clienteId = new ObjectId(clienteId);
        this.propuestaId = new ObjectId(propuestaId);
        this.descripcion = descripcion;
        this.valor = valor;
        this.fechaInicio = fechaInicio;
        this.estado = estado;
        this.avances = avances;
        this.contratoId = contratoId ? new ObjectId(contratoId) : null;
    }
}

export async function proyectoModel() {
    const client = await connection();
    return client.db().collection('proyectos');
}