import { connection } from '../config/db.js';
import { ObjectId } from 'mongodb';

export class Transaccion {
constructor({ id, proyectoId, cliente, tipo, monto, fecha, descripcion }) {
    if (!proyectoId || !tipo || !monto) {
    throw new Error('proyectoId, tipo y monto son obligatorios.');
    }

    this._id = id ? new ObjectId(id) : null;
    this.proyectoId = new ObjectId(proyectoId);
    this.cliente = cliente?.trim() || 'Desconocido';
    this.tipo = tipo.toLowerCase(); // 'ingreso' o 'egreso'
    this.monto = monto;
    this.fecha = fecha ? new Date(fecha) : new Date();
    this.descripcion = descripcion?.trim() || '';

    this.validar();
}

validar() {
    if (!['ingreso', 'egreso'].includes(this.tipo)) {
    throw new Error("El tipo debe ser 'ingreso' o 'egreso'");
    }
    if (typeof this.monto !== 'number' || this.monto <= 0) {
    throw new Error('El monto debe ser un número mayor a 0');
    }
    if (typeof this.cliente !== 'string' || !this.cliente) {
    throw new Error('El cliente debe ser una cadena no vacía');
    }
}

mostrar() {
    return `📌 Proyecto: ${this.proyectoId}, Cliente: ${this.cliente}, Tipo: ${this.tipo}, Monto: $${this.monto}, Fecha: ${this.fecha.toLocaleDateString()}, Descripción: ${this.descripcion}`;
}
}

export class MostrarTransaccion {
mostrar(transaccion) {
    console.log(transaccion.mostrar());
}
}

export async function transaccionModel() {
const db = await connection();
return db.collection('transacciones');
}
