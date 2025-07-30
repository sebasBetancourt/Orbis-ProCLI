import { connection } from "../config/db.js";

export class Client {
    constructor(nombre, email, telefono, empresa){
      if (!nombre || !email || !telefono) {
        throw new Error('Todos los campos son obligatorios.');
      }
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
      this.empresa = empresa;
    };

    mostrarCliente(){
      return `Nombre: ${this.nombre}, Email: ${this.email}, Telefono: ${this.telefono}, Empresa: ${this.empresa}`
    }

  }
  


export async function clienteModel(){
    const db = await connection();
    return db.collection('clientes')
}