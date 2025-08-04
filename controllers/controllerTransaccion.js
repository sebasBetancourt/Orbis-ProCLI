import { mostrarMenuTransaccion } from '../helpers/menuTransaccion.js';
import chalk from 'chalk';
import { TransaccionService } from '../services/serviceTransaccion.js';

export async function adminTransaccion() {
let salir = false;
const transaccionService = new TransaccionService();

while (!salir) {
    const opcion = await mostrarMenuTransaccion();

    switch (opcion) {
    case '1':
        console.clear();
        await transaccionService.crearTransaccion();
        break;

    case '2':
        console.clear();
        await transaccionService.listarTransacciones();
        break;

    case '3':
        console.clear();
        await transaccionService.calcularBalance();
        break;

    case '4':
        console.clear();
        await transaccionService.eliminarTransaccion();
        break;

    case '0':
        salir = true;
        console.log(chalk.bold.red(' Cerrado exitosamente...'));
        break;

    default:
        console.log(chalk.yellow('Opción no válida, intenta de nuevo.'));
        break;
    }
}
}

