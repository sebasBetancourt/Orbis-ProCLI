import { connection } from '../config/db.js';

export class Proyecto {
  constructor({ clienteId, propuestaId, nombre, estado, avances, contrato, entregables }) {
    if (!clienteId || !propuestaId || !nombre || !estado || !contrato || !entregables) {
      throw new Error("Todos los campos obligatorios del proyecto deben ser proporcionados.");
    }

    this.clienteId = clienteId;
    this.propuestaId = propuestaId;
    this.nombre = nombre;
    this.estado = estado;
    this.avances = avances;
    this.contrato = contrato;
    this.entregables = entregables;

    this.validar();
  }

  validar() {
    if (typeof this.nombre !== 'string' || !this.nombre.trim()) {
      throw new Error('El nombre debe ser una cadena no vacía');
    }
    if (!['pausado', 'activo', 'completado'].includes(this.estado)) {
      throw new Error('Estado inválido');
    }
    if (typeof this.avances !== 'number' || this.avances < 0) {
      throw new Error('Los avances deben ser un número no negativo');
    }
    if (!this.contrato || typeof this.contrato !== 'object') {
      throw new Error('El contrato debe ser un objeto válido');
    }
    if (!this.contrato.fechaInicio || !(this.contrato.fechaInicio instanceof Date)) {
      throw new Error('La fecha de inicio del contrato debe ser una fecha válida');
    }
    if (!this.contrato.fechaFin || !(this.contrato.fechaFin instanceof Date)) {
      throw new Error('La fecha de fin del contrato debe ser una fecha válida');
    }
    if (typeof this.contrato.valorTotal !== 'number' || this.contrato.valorTotal <= 0) {
      throw new Error('El valor total del contrato debe ser un número mayor a 0');
    }
    if (typeof this.contrato.condiciones !== 'string' || !this.contrato.condiciones.trim()) {
      throw new Error('Las condiciones del contrato deben ser una cadena no vacía');
    }
    if (!['pendiente', 'aprobado'].includes(this.contrato.estado)) {
      throw new Error('Estado del contrato inválido');
    }
    if (!Array.isArray(this.entregables) || this.entregables.length === 0) {
      throw new Error('Los entregables deben ser un arreglo no vacío');
    }
    this.entregables.forEach((entregable, index) => {
      if (!entregable.titulo || typeof entregable.titulo !== 'string' || !entregable.titulo.trim()) {
        throw new Error(`El entregable ${index + 1} debe tener un título válido`);
      }
      if (!entregable.fechaLimite || !(entregable.fechaLimite instanceof Date)) {
        throw new Error(`El entregable ${index + 1} debe tener una fecha límite válida`);
      }
      if (!['pendiente', 'aprobado'].includes(entregable.estado)) {
        throw new Error(`El entregable ${index + 1} tiene un estado inválido`);
      }
    });
  }
}

export async function proyectoModel() {
  const db = await connection();
  return db.collection('proyectos');
}