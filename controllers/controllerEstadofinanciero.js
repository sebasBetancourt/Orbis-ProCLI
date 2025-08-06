import chalk from 'chalk';
import { EstadoService } from '../services/serviceEstadofinanciero.js';
import {mostrarMenuEstadofinanciero} from '../helpers/menuEstadofinanciero.js';

export async function adminEstado() {
  const estadoService = new EstadoService();
  let salir = false;

  try {
    while (!salir) {
      const opcion = await mostrarMenuEstadofinanciero();
      switch (opcion) {
        case '1':
          await estadoService.Ingresos();
          break;
        case '2':
          await estadoService.egresos();
          break;
        case '3':
          await estadoService.balance();
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