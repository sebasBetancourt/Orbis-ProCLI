import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';

export class Propuesta {
  constructor({ id, clienteId, descripcion, precio, plazo, estado, fechaCreacion }) {
    if (!clienteId || !descripcion || !precio || !plazo) {
      throw new Error('Todos los campos son obligatorios.');
    }
    this._id = id ? new ObjectId(id) : null;
    this.clienteId = new ObjectId(clienteId);
    this.descripcion = descripcion;
    this.precio = precio;
    this.plazo = plazo;
    this.estado = estado || 'pendiente';
    this.fechaCreacion = fechaCreacion || new Date();

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
    return `Descripción: ${this.descripcion}, Cliente: ${clienteNombre || 'Desconocido'}, Precio: $${this.precio}, Plazo: ${this.plazo} días, Estado: ${this.estado}`;
  }
}

// Clase para mostrar propuestas (consistente con mostrarCliente)
export class MostrarPropuesta {
  mostrar(propuesta, clienteNombre) {
    console.log(propuesta.mostrar(clienteNombre));
  }
}

// Factory Method para crear propuestas y proyectos (OCP)
export class PropuestaFactory {
  static crearPropuesta(datos) {
    return new Propuesta(datos);
  }

  static async crearProyectoDesdePropuesta(propuesta, proyectoModel) {
    const proyectoDatos = {
      clienteId: propuesta.clienteId,
      nombre: `Proyecto: ${propuesta.descripcion}`,
      descripcion: propuesta.descripcion,
      estado: 'activo',
      fechaInicio: new Date(),
    };
    const proyectoCollection = await proyectoModel();
    return proyectoCollection.insertOne(proyectoDatos);
  }
}

// Función para obtener la colección de propuestas
export async function propuestaModel() {
  const db = await connection();
  return db.collection('propuestas');
}