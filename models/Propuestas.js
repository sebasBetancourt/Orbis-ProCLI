import { connection } from "../config/db.js";

export class Propuesta {
    constructor(clienteId, descripcion, precio, plazoDias, estado){
      if (!clienteId || !descripcion || !precio || !plazoDias || !estado) {
        throw new Error('Todos los campos son obligatorios.');
      }
      this.clienteId = clienteId;
      this.descripcion = descripcion;
      this.precio = precio;
      this.plazoDias = plazoDias;
      this.estado = estado
    };


  }
  

export class mostrarPropuesta{
  mostrar(Propuesta){
    console.log(`Descripcion: ${Propuesta.descripcion}, Precio: ${Propuesta.precio}, Plazo en Dias: ${Propuesta.plazoDias}, Estado: ${Propuesta.estado}`);
    
  }
}


export async function propuestaModel(){
    const db = await connection();
    return db.collection('propuestas')
}