import { connection } from "../config/db.js";

export class Propuesta {
    constructor( clienteId, descripcion, precio, plazoDias, estado ){
      this.clienteId = clienteId;
      this.descripcion = descripcion;
      this.precio = precio;
      this.plazoDias = plazoDias;
      this.estado = estado;
    }
  
    mostrarPropuesta(){
      console.log(`Descripcion: ${this.descripcion}, Precio: ${this.precio}, Plazo en dias: ${this.plazoDias}, Estado: ${this.estado} `);
    }
  }
  
  export async function propuestaModel(){
    const db = await connection();
    return db.collection('propuestas')
}
