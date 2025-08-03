import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';

export class Entregable {
constructor({ id, contratoId, descripcion, fechaLimite, estado = 'pendiente' }) {
    if (!contratoId || !descripcion || !fechaLimite) {
    throw new Error('Todos los campos obligatorios deben estar presentes.');
    }

    this._id = id ? new ObjectId(id) : null;
    this.contratoId = new ObjectId(contratoId);
    this.descripcion = descripcion;
    this.fechaLimite = new Date(fechaLimite);
    this.estado = estado;

    this.validar();
}

validar() {
    if (typeof this.descripcion !== 'string' || !this.descripcion.trim()) {
    throw new Error('La descripción debe ser una cadena no vacía.');
    }

    const estadosValidos = ['pendiente', 'entregado', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(this.estado)) {
    throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    if (isNaN(this.fechaLimite.getTime())) {
    throw new Error('La fecha límite debe ser una fecha válida.');
    }
}

mostrar() {
    return `ContratoID: ${this.contratoId}, Descripción: ${this.descripcion}, Fecha límite: ${this.fechaLimite.toLocaleDateString()}, Estado: ${this.estado}`;
}
}

export class MostrarEntregable {
mostrar(entregable) {
    console.log(entregable.mostrar());
}
}

export async function entregableModel() {
const db = await connection();
return db.collection('entregables');
}
