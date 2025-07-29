import chalk from 'chalk';
import mostrarMenu from './helpers/menu.js';
import { Client } from './models/Cliente.js';
import { ClienteServiceCrear } from './services/serviceCliente.js';
import Worker from 'worker_threads'

async function main() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenu();

    switch (opcion) {


      case '1':
        const nuevoCliente = new ClienteServiceCrear()
        await nuevoCliente.crearCliente()
        break

      case '2':
        console.log("caso 2");
        break;
      case '3':
        console.log("caso 3");
        break;
      case '4':
        console.log("caso 4");
        break;
      case '5':
        console.log("caso 5");
        break;
      case '6':
          console.log("caso 6");
          break;
      case '0':
        salir = true;
        console.log(chalk.bold.red(' Cerrado exitosamente...'));
        break;
    }
  }
}

main();