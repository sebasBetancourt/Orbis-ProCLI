import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';

export class Proyecto {
  constructor({ id, clienteId, nombre, descripcion, estado, fechaInicio }) {
    if (!clienteId || !nombre || !descripcion) {
      throw new Error('Todos los campos son obligatorios.');
    }
    this._id = id ? new ObjectId(id) : null;
    this.clienteId = new ObjectId(clienteId);
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado || 'activo';
    this.fechaInicio = fechaInicio || new Date();

    this.validar();
  }

  validar() {
    if (typeof this.nombre !== 'string' || !this.nombre.trim()) {
      throw new Error('El nombre debe ser una cadena no vacía');
    }
    if (typeof this.descripcion !== 'string' || !this.descripcion.trim()) {
      throw new Error('La descripción debe ser una cadena no vacía');
    }
    if (!['activo', 'pausado', 'finalizado', 'cancelado'].includes(this.estado)) {
      throw new Error('Estado inválido');
    }
  }

  mostrar() {
    return `Nombre: ${this.nombre}, ClienteID: ${this.clienteId}, Estado: ${this.estado}`;
  }
}

export class MostrarProyecto {
  mostrar(proyecto) {
    console.log(proyecto.mostrar());
  }
}

export async function proyectoModel() {
  const db = await connection();
  return db.collection('proyectos');
}