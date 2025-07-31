import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';

export class Contrato {
  constructor({ id, proyectoId, condiciones, fechaInicio, fechaFin, valorTotal }) {
    if (!proyectoId || !condiciones || !valorTotal) {
      throw new Error('Todos los campos son obligatorios.');
    }
    this._id = id ? new ObjectId(id) : null;
    this.proyectoId = new ObjectId(proyectoId);
    this.condiciones = condiciones;
    this.fechaInicio = fechaInicio || new Date();
    this.fechaFin = fechaFin;
    this.valorTotal = valorTotal;

    this.validar();
  }

  validar() {
    if (typeof this.condiciones !== 'string' || !this.condiciones.trim()) {
      throw new Error('Las condiciones deben ser una cadena no vacía');
    }
    if (typeof this.valorTotal !== 'number' || this.valorTotal <= 0) {
      throw new Error('El valor total debe ser un número mayor a 0');
    }
  }

  mostrar() {
    return `ProyectoID: ${this.proyectoId}, Condiciones: ${this.condiciones}, Valor: $${this.valorTotal}`;
  }
}

export class MostrarContrato {
  mostrar(contrato) {
    console.log(contrato.mostrar());
  }
}

export async function contratoModel() {
  const db = await connection();
  return db.collection('contratos');
}