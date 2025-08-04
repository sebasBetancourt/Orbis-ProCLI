import chalk from 'chalk';
import { PropuestaService } from '../services/servicePropuestas.js';
import mostrarMenuPropuesta from '../helpers/menuPropuesta.js';

export async function adminPropuesta() {
  const propuestaService = new PropuestaService();
  let salir = false;

  try {
    while (!salir) {
      const opcion = await mostrarMenuPropuesta();
      switch (opcion) {
        case '1':
          await propuestaService.crearPropuesta();
          break;
        case '2':
          await propuestaService.listarPropuestas();
          break;
        case '3':
          await propuestaService.actualizarPropuesta();
          break;
        case '4':
          await propuestaService.eliminarPropuesta();
          break;
        case '0':
          salir = true;
          console.log(chalk.red.bold('Volviendo al menú principal...'));
          break;
        default:
          console.log(chalk.red('Opción no válida'));
      }
    }
  } catch (error) {
    console.log(chalk.red(`Error en adminPropuesta: ${error.message}`));
  }
}