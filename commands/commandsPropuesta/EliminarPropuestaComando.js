import { Comando } from './Comando.js';
import { propuestaModel } from '../../models/Propuestas.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { seleccionarPropuestaPaginado } from '../../utils/seleccionPropuesta.js';

export class EliminarPropuestaComando extends Comando {
  async ejecutar() {
    try {
      const propuestaCollection = await propuestaModel();
      const propuestaSeleccionada = await seleccionarPropuestaPaginado(
        propuestaCollection,
        'Selecciona una propuesta para eliminar🔴:',
        { estado: { $in: ['pendiente', 'rechazada'] } }
      );

      if (!propuestaSeleccionada) {
        console.log(chalk.yellow("\nOperación cancelada.❌\n"));
        return;
      }

      const { confirmDelete } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmDelete',
          message: chalk.bgRed(`¿Estás seguro de que deseas eliminar la propuesta "${propuestaSeleccionada.descripcion}"? ⚠️`),
        },
      ]);

      if (confirmDelete) {
        await propuestaCollection.deleteOne({ _id: propuestaSeleccionada._id });
        console.log(chalk.green("Propuesta eliminada exitosamente✅"));
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
    } catch (error) {
      console.error(chalk.red(`Error al eliminar la propuesta: ${error.message}`));
    }
  }
}