import { connection } from "../config/db.js";

export class Propuesta {
    constructor(id, nombre, descripcion, precio, plazos, estados){
      this.id = id;
      this.nombre = nombre;
      this.descripcion = descripcion;
      this.precio = precio;
      this.plazos = plazos;
      this.estados = estados;
    }
  
    generarProyecto(){
        if(estados === "aceptada"){
            throw new Error("Aqui nose puede");
        }
    }
  }
  
