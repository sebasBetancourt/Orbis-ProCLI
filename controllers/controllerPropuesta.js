import chalk from 'chalk';
import { PropuestaService } from '../services/servicePropuestas.js';
import {mostrarMenuPropuesta} from '../helpers/menuPropuesta.js';

export async function adminCliente() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenuPropuesta();
    const nuevoCliente = new PropuestaService();
    switch (opcion) {


      case '1':
        console.clear();
        await nuevoCliente.crearCliente();
        break

      case '2':
        console.clear()
        await nuevoCliente.listarCliente();
        break;
      case '3':
        console.clear()
        await nuevoCliente.actualizarCliente();
        break;
      case '4':
        console.clear()
        await nuevoCliente.eliminarCliente();
        break;
      case '0':
        salir = true;
        console.log(chalk.bold.red(' Cerrado exitosamente...'));
        break;
    }
  }
}