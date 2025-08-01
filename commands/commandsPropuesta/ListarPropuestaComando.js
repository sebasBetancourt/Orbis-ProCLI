import { Comando } from './Comando.js';
import { propuestaModel } from '../../models/Propuestas.js';
import { clienteModel } from '../../models/Cliente.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { seleccionarPropuestaPaginado } from '../../utils/seleccionPropuesta.js';

export class ListarPropuestaComando extends Comando {
  async ejecutar() {
    const propuestaCollection = await propuestaModel();
    const clienteCollection = await clienteModel();
    try {
      const propuestaSeleccionada = await seleccionarPropuestaPaginado(propuestaCollection, 'Selecciona una Propuesta para ver: ')
      if (!propuestaSeleccionada) {
        return chalk.red.bold('Seleccion Invalida');
      }

      let clienteNombre = 'hola'
      const clienteId = propuestaSeleccionada.clienteId;
      if (clienteId) {
        const cliente = await clienteCollection.findOne({ _id: clienteId });
        clienteNombre = cliente ? cliente.nombre : 'Desconocido';
      }

      console.log(chalk.green.bold("\nDetalles de la Propuesta:\n"));
      console.log(`${chalk.bold("Descripcion:")} ${propuestaSeleccionada.descripcion}`);
      console.log(`${chalk.bold("Precio:")} ${propuestaSeleccionada.precio}`);
      console.log(`${chalk.bold("Plazo:")} ${propuestaSeleccionada.plazo}`);
      console.log(`${chalk.bold("Estado:")} ${propuestaSeleccionada.estado}`);
      console.log(`${chalk.bold("Cliente Asociado:")} ${clienteNombre}`);
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('Presiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      console.log(chalk.red(`Error sudo: ${error.message}`));
    }

  }
}