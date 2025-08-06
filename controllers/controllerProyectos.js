import chalk from 'chalk';
import { ProyectoService } from '../services/serviceProyectos.js';
import { mostrarMenuProyectos } from '../helpers/menuProyectos.js'

export async function adminProyecto() {
  const proyectoService = new ProyectoService();
  let salir = false;

  try {
    while (!salir) {
      const opcion = await mostrarMenuProyectos();
      switch (opcion) {
        case '1':
          await proyectoService.listarProyectos();
          break;
        case '2':
          await proyectoService.actualizarProyecto();
          break;
        case '3':
          await proyectoService.eliminarProyecto();
          break;
        case '4':
          await proyectoService.registrarAvance();
          break;
        case '5':
          await proyectoService.clonarProyecto();
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
    console.log(chalk.red(`Error en adminProyecto: ${error.message}`));
  }
}