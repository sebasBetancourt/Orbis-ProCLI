import chalk from 'chalk';
import mostrarMenu from './helpers/menu.js';

async function main() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenu();

    switch (opcion) {
      case '1':
        console.log("caso 1");
        break;
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