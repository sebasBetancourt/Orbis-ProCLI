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


  }
  

export class mostrarCliente{
  mostrar(Cliente){
    console.log(`Nombre: ${Cliente.nombre}, Email: ${Cliente.email}, Telefono: ${Cliente.telefono}, Empresa: ${Cliente.empresa}`);
    
  }
}


export async function clienteModel(){
    const db = await connection();
    return db.collection('clientes')
}