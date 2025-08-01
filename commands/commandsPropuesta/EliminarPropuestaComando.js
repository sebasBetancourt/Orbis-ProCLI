import { Comando } from './Comando.js';
import { Propuesta, propuestaModel } from '../../models/Propuestas.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { seleccionarPropuestaPaginado } from '../../utils/seleccionPropuesta.js';

export class EliminarPropuestaComando extends Comando {
  async ejecutar() {
    const propuestaCollection = await propuestaModel();
    const propuestaSeleccionada = await seleccionarPropuestaPaginado(propuestaCollection, 'Selecciona una propuesta para eliminar🔴:');

    if (!propuestaSeleccionada) {
      console.log(chalk.yellow("\nOperación cancelada.❌\n"));
      return;
    }

    const { confirmDelete } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: chalk.bgRed('¿Estás seguro de que deseas eliminar esta Propuesta? ⚠️'),
      },
    ]);

    if (confirmDelete) {
      await propuestaCollection.deleteOne({ _id: propuestaSeleccionada._id });
      console.log(chalk.green("Propuesta Eliminada exitosamente✅"));
    } else {
      console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
      },
    ]);
  }
}