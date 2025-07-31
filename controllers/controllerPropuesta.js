import chalk from 'chalk';
import { PropuestaService } from '../services/servicePropuestas.js';
import { RepositorioMongo } from '../services/repositorioMongo.js';
// import { proyectoService } from '../services/serviceProyecto.js';
import { connection } from '../config/db.js';
import {mostrarMenuPropuesta} from '../helpers/menuPropuesta.js';

// Responsabilidad: Coordinar la gestión de propuestas (SRP)
export async function adminPropuesta() {
  const repositorio = new RepositorioMongo(connection); // Inyección de dependencia
  // const proyectoService = new ProyectoService(repositorio); // Para crear proyectos
  // const propuestaService = new PropuestaService(repositorio, proyectoService);
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenuPropuesta();
    switch (opcion) {
      case '1':
        console.log("1");
        // await propuestaService.crearPropuesta();
        break;
      case '2':
        console.log("1");
        // await propuestaService.listarPropuestas();
        break;
      case '3':
        console.log("1");
        // Lógica para actualizar estado (implementada por ti)
        break;
      case '4':
        console.log("1");
        // Lógica para eliminar propuesta (implementada por ti)
        break;
      case '0':
        salir = true;
        console.log(chalk.red.bold('Volviendo al menú principal...'));
        break;
      default:
        console.log(chalk.red('Opción no válida'));
    }
  }
}