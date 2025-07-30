import { connection } from "../config/db.js";

export class Client {
    constructor(nombre, email, telefono){
      if (!nombre || !email || !telefono) {
        throw new Error('Todos los campos son obligatorios.');
      }
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
    };

    mostrarCliente(){
      return `Nombre: ${this.nombre}, Email: ${this.email}, Telefono: ${this.telefono}`
    }

  }
  


export async function clienteModel(){
    const db = await connection();
    return db.collection('clientes')
}