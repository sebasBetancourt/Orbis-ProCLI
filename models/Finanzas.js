import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

export class Finanza {
  constructor({ tipo, monto, fecha, descripcion, proyectoId, clienteId }) {
    if (!['ingreso', 'egreso'].includes(tipo)) {
      throw new Error('El tipo debe ser "ingreso" o "egreso"');
    }
    if (typeof monto !== 'number' || monto <= 0) {
      throw new Error('El monto debe ser un número positivo');
    }
    const parsedFecha = fecha ? dayjs(fecha, 'YYYY-MM-DD', true) : dayjs();
    if (!parsedFecha.isValid()) {
      throw new Error('La fecha debe ser válida en formato YYYY-MM-DD');
    }
    if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
      throw new Error('La descripción es requerida y debe ser un string no vacío');
    }
    if (!proyectoId || !ObjectId.isValid(proyectoId)) {
      throw new Error('El proyectoId debe ser un ObjectId válido');
    }
    if (!clienteId || !ObjectId.isValid(clienteId)) {
      throw new Error('El clienteId debe ser un ObjectId válido');
    }

    this._id = new ObjectId();
    this.tipo = tipo;
    this.monto = monto;
    this.fecha = parsedFecha.toDate();
    this.descripcion = descripcion.trim();
    this.proyectoId = new ObjectId(proyectoId);
    this.clienteId = new ObjectId(clienteId);
    this.createdAt = new Date();
  }
}

export async function finanzaModel() {
  const db = await connection();
  return db.collection('finanzas');
}