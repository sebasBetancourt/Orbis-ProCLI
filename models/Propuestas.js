import chalk from 'chalk';
import { connection } from '../config/db.js';

export class Propuesta {
  constructor({ clienteId, descripcion, precio, plazo, estado }) {
    if (!clienteId || !descripcion || !precio || !plazo) {
      throw new Error('Todos los campos son obligatorios.');
    }
    this.clienteId = clienteId;
    this.descripcion = descripcion;
    this.precio = precio;
    this.plazo = plazo;
    this.estado = estado || 'pendiente';

    this.validar();
  }

  validar() {
    if (typeof this.descripcion !== 'string' || !this.descripcion.trim()) {
      throw new Error('La descripción debe ser una cadena no vacía');
    }
    if (typeof this.precio !== 'number' || this.precio <= 0) {
      throw new Error('El precio debe ser un número mayor a 0');
    }
    if (typeof this.plazo !== 'number' || this.plazo <= 0) {
      throw new Error('El plazo debe ser un número mayor a 0');
    }
    if (!['pendiente', 'aceptada', 'rechazada'].includes(this.estado)) {
      throw new Error('Estado inválido');
    }
  }

  mostrar(clienteNombre) {
    return `${chalk.red.bold('Descripción:')} ${this.descripcion}, ${chalk.red.bold('Cliente:')} ${clienteNombre }, ${chalk.red.bold('Precio:')} $${this.precio}, ${chalk.red.bold('Plazo:')} ${this.plazo} días, ${chalk.red.bold('Estado:')} ${this.estado}`;
  }
}





export async function propuestaModel() {
  const db = await connection();
  return db.collection('propuestas');
}