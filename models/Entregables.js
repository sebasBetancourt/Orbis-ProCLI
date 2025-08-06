import { connection } from '../config/db.js';

export class Entregable {
constructor({ titulo, fechaLimite, estado = 'pendiente' }) {
    if (!titulo || !fechaLimite) {
        throw new Error('Todos los campos obligatorios deben estar presentes.');
    }

    this.titulo = titulo;
    this.fechaLimite = new Date(fechaLimite);
    this.estado = estado;

    this.validar();
}

validar() {
    if (typeof this.titulo !== 'string' || !this.titulo.trim()) {
    throw new Error('El titulo debe ser una cadena no vacía.');
    }

    const estadosValidos = ['pendiente', 'entregado', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(this.estado)) {
    throw new Error(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
    }

    if (isNaN(this.fechaLimite.getTime())) {
    throw new Error('La fecha límite debe ser una fecha válida.');
    }
}

}



export async function entregableModel() {
const db = await connection();
return db.collection('entregables');
}
