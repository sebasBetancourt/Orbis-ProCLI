import mostrarMenuCliente from '../helpers/menuCliente.js';
import chalk from 'chalk';
import { ClienteService } from '../services/serviceCliente.js';

export async function adminCliente() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenuCliente();
    const nuevoCliente = new ClienteService();
    switch (opcion) {


      case '1':
        await nuevoCliente.crearCliente();
        break

      case '2':
        await nuevoCliente.listarCliente();
        break;
      case '3':
        await nuevoCliente.actualizarCliente();
        break;
      case '4':
        await nuevoCliente.eliminarCliente();
        break;
      case '0':
        salir = true;
        console.log(chalk.bold.red(' Cerrado exitosamente...'));
        break;
    }
  }
}