import chalk from 'chalk';
import mostrarMenu from './helpers/menu.js';
import { adminCliente } from './controllers/controllerCliente.js';
import { adminPropuesta } from './controllers/controllerPropuesta.js';
import { adminContrato } from './controllers/controllerContrato.js';
import { adminEntregable } from './controllers/controllerEntregable.js';
import { adminTransaccion } from './controllers/controllerTransaccion.js';

async function main() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenu();

    switch (opcion) {


      case '1':
        await adminCliente();
        break;

      case '2':
        await adminPropuesta();
        break;
      case '3':
        console.log("caso 3");
        break;
      case '4':
        await adminContrato();
        break;
      case '5':
        await adminEntregable();
        break;
      case '6':
          await adminTransaccion();
          break;
      case '0':
        salir = true;
        console.log(chalk.bold.red(' Cerrado exitosamente...'));
        break;
    }
  }
}

main();