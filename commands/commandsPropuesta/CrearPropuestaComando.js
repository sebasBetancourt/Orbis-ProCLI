import inquirer from 'inquirer';
import chalk from 'chalk';

import { propuestaModel, Propuesta } from '../../models/Propuestas.js';
import { Comando } from './Comando.js';
import { clienteModel } from '../../models/Cliente.js';
import { pedirDatosPropuesta } from '../../utils/pedirDatosPropuesta.js';

export class CrearPropuestaComando extends Comando{
  async ejecutar(){
    try {
      const modeloCliente = await clienteModel()
      const { clienteId, descripcion, precio, plazo, clienteNombre} = await pedirDatosPropuesta(modeloCliente);
      
      const modeloPropuesta = await propuestaModel();      
      const propuesta = new Propuesta({clienteId, descripcion, precio, plazo});
      await modeloPropuesta.insertOne(propuesta);
      console.log(propuesta.mostrar(clienteNombre));
      console.log(chalk.green("Propuesta Agregada Exitosamente✅"));
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      throw new Error("Error al Crear Propuesta: "+ error);
      
    }
  }  
}