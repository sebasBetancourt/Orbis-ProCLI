import { ObjectId } from 'mongodb';
import { connection } from '../config/db.js';

export class Finanza {
  constructor({ proyectoId, tipo, concepto, monto, fecha }) {
    if (!proyectoId || !tipo || !concepto || !monto || !fecha) {
      throw new Error('Todos los campos obligatorios deben ser proporcionados.');
    }

    this.proyectoId = proyectoId instanceof ObjectId ? proyectoId : new ObjectId(proyectoId);
    this.tipo = tipo;
    this.concepto = concepto;
    this.monto = monto;
    this.fecha = fecha instanceof Date ? fecha : new Date(fecha);

    this.validar();
  }

  validar() {
    if (!['ingreso', 'egreso'].includes(this.tipo)) {
      throw new Error('El tipo debe ser "ingreso" o "egreso".');
    }
    if (typeof this.concepto !== 'string' || !this.concepto.trim()) {
      throw new Error('El concepto debe ser una cadena no vacía.');
    }
    if (typeof this.monto !== 'number' || this.monto <= 0) {
      throw new Error('El monto debe ser un número mayor a 0.');
    }
    if (!(this.fecha instanceof Date) || isNaN(this.fecha)) {
      throw new Error('La fecha debe ser válida.');
    }
  }
}

export async function finanzaModel() {
  const db = await connection();
  return db.collection('finanzas');
}