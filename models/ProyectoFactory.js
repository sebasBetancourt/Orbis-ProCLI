import { Propuesta } from './Propuestas.js';
import { datosContrato } from '../utils/pedirDatosContrato.js'
import chalk from 'chalk';

export class ProyectoFactory {
  static async crearContratoDesdeProyecto(proyecto, contratoModel) {
    try {
      const idProyecto = proyecto._id;
      console.log(chalk.green.bold("\nCreando Contrato.....📖"));
      const { fechaInicio, fechaFin, condiciones, valorTotal } = await datosContrato(idProyecto);
      
      const contratoDatos = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        valorTotal: valorTotal,
        condiciones: condiciones
      };

      const contratoCollection = await contratoModel();
      const result = await contratoCollection.insertOne(contratoDatos);

      
      return { _id: result.insertedId, ...contratoDatos };
    } catch (error) {
      throw new Error(`Error al crear contrato: ${error.message}`);
    }
  }
}