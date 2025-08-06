import chalk from 'chalk';
import mostrarMenu from './helpers/menu.js';
import { adminCliente } from './controllers/controllerCliente.js';
import { adminPropuesta } from './controllers/controllerPropuesta.js';
import { adminProyecto } from './controllers/controllerProyectos.js';
import { adminFinanza } from './controllers/controllerFinanza.js';

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
        await adminProyecto();
        break;
      case '4':
        await adminFinanza();
      case '0':
        salir = true;
        console.log(chalk.bold.red('Cerrado exitosamente...'));
        break;
    }
  }
}

main();