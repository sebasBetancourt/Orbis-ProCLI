import { mostrarMenuEntregable } from '../helpers/menuEntregable.js';
import chalk from 'chalk';
import { EntregableService } from '../services/serviceEntregable.js';

export async function adminEntregable() {
let salir = false;
const entregableService = new EntregableService();

while (!salir) {
    const opcion = await mostrarMenuEntregable();

    switch (opcion) {
    case '1':
        console.clear();
        console.log("Caso 1: Crear entregable (no implementado).");
        break;

    case '2':
        console.clear();
        console.log("Caso 2: Listar entregables (no implementado).");
        break;

    case '3':
        console.clear();
        console.log("Caso 3: Actualizar entregable (no implementado).");
        break;

    case '4':
        console.clear();
        await entregableService.eliminarEntregable();
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
