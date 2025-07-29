import { connection } from "../config/db.js";

export class Client {
    constructor(nombre, email, telefono){
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
    }
    mostrarCliente(){
      console.log(`Nuevo Cliente⚠️: Nombre: ${this.nombre}, Email: ${this.email}, Telefono: ${this.telefono}`);
    }
  }
  


export async function clienteModel(){
    const db = await connection();
    return db.collection('clientes')
}