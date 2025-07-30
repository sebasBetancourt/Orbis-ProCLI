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