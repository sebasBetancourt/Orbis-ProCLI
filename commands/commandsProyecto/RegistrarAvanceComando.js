import chalk from 'chalk';
import { mostrarMenuEntregables } from '../../helpers/menuEntregables.js';
import { VerEntregables } from './commandsEntregables/VerEntregablesComando.js';
import { CrearEntregable } from './commandsEntregables/CrearEntregableComando.js';
import { CambiarEntregable } from './commandsEntregables/CambiarEntregableComando.js';
import { Comando } from '../commandsPropuesta/Comando.js';

export class RegistrarAvanceComando extends Comando {
  async ejecutar() {
    let salir = false;

    while (!salir) {
      console.clear(); 
      const opcion = await mostrarMenuEntregables();

      switch (opcion) {
        case '1':
          const verEntregable = new VerEntregables();
          await verEntregable.ejecutar();
          break;

        case '2':
          const crearEntregable = new CrearEntregable();
          await crearEntregable.ejecutar();
          break;

        case '3':
          const cambiarEntregable = new CambiarEntregable();
          await cambiarEntregable.ejecutar();
          break;

        case '0':
          salir = true;
          console.clear();
          console.log(chalk.red.bold('Volviendo al menú principal...'));
          break;

        default:
          console.clear();
          console.log(chalk.red('Opción no válida'));
          await inquirer.prompt([
            {
              type: 'input',
              name: 'continuar',
              message: chalk.blueBright('Presiona Enter para continuar...'),
            },
          ]);
      }
    }
  }
}