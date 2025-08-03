import chalk from 'chalk';
import mostrarMenuProyecto from '../helpers/menuProyectos.js'; 
import { ProyectoService } from '../services/serviceProyectos.js';
import { TransaccionService } from '../services/serviceTransaccionPropuesta.js';

export async function adminProyecto() {
  let salir = false;
  const proyectoService = new ProyectoService();
  const transaccionService = new TransaccionService();

  while (!salir) {
    const opcion = await mostrarMenuProyecto();

    switch (opcion) {
      case '1':
        console.log(chalk.yellow('Para crear un proyecto, debes aceptar una propuesta.'));
        await transaccionService.aceptarPropuestaMenu();
        break;
      case '2':
        // Aquí iría el método para listar proyectos
        console.log('Listar Proyectos...');
        break;
      case '3':
        // Aquí iría el método para actualizar proyectos
        console.log('Actualizar Proyecto...');
        break;
      case '4':
        // Aquí iría el método para eliminar proyectos
        console.log('Eliminar Proyecto...');
        break;
      case '5':
        // Aquí iría el método para registrar avance
        console.log('Registrar Avance...');
        break;
      case '0':
        salir = true;
        console.log(chalk.red.bold('Volviendo al menú principal...'));
        break;
      default:
        console.log(chalk.red('Opción no válida.'));
    }
  }
}