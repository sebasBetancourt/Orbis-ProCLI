import { Propuesta } from './Propuestas.js';
import { pedirDatosProyecto } from '../utils/pedirDatosProyecto.js';
import chalk from 'chalk';

export class PropuestaFactory {
  static crearPropuesta(datos) {
    return new Propuesta(datos);
  }

  static async crearProyectoDesdePropuesta(propuesta, proyectoModel) {
    try {
      // Pedir solo el nombre del proyecto
      const { nombre } = await pedirDatosProyecto();
      
      const proyectoDatos = {
        clienteId: propuesta.clienteId,
        propuestaId: propuesta._id,
        nombre: nombre,
        estado: 'pausado',
        avances: 0,
        contrato: 'pendiente',
        entregables: 'pendiente'
      };

      const proyectoCollection = await proyectoModel();
      const result = await proyectoCollection.insertOne(proyectoDatos);
      return result;
    } catch (error) {
      throw new Error(`Error al crear proyecto: ${error.message}`);
    }
  }
}