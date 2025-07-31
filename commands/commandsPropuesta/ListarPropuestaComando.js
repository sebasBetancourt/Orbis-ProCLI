import { Comando } from './Comando.js';
import { Propuesta, MostrarPropuesta, propuestaModel } from '../../models/Propuestas.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ListarPropuestaComando extends Comando {
  async ejecutar() {
    const propuestaCollection = await propuestaModel();
    try {
      const propuestas = await propuestaCollection.find().toArray();
      console.log(chalk.yellow.bold('\nLista de Propuestas:\n'));
      if (propuestas.length === 0) {
        console.log(chalk.red('No hay propuestas registradas.'));
      } else {
        propuestas.forEach((propuesta, index) => {
          const prop = new Propuesta(propuesta);
          console.log(chalk.cyan(`${index + 1}. ${prop.mostrar('Desconocido')}`));
        });
      }
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('Presiona Enter para continuar...'),
      },
    ]);
  }
}