import { FinanzaService } from '../services/serviceFinanzas.js';
import { mostrarMenuFinanza } from '../helpers/menuFinanzas.js';
import chalk from 'chalk';

export async function adminFinanza() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenuFinanza();
    const finanzaService = new FinanzaService();

    switch (opcion) {
      case '1':
        console.clear();
        await finanzaService.crearFinanza();
        break;
      case '2':
        console.clear();
        await finanzaService.listarFinanzas();
        break;
      case '3':
        console.clear();
        await finanzaService.actualizarFinanza();
        break;
      case '4':
        console.clear();
        await finanzaService.eliminarFinanza();
        break;
      case '5':
        console.clear();
        await finanzaService.calcularBalance();
        break;
      case '0':
        salir = true;
        console.log(chalk.bold.red('Cerrado exitosamente...'));
        break;
    }
  }
}