import { mostrarMenuContrato } from '../helpers/menuContrato.js';
import chalk from 'chalk';
import { ContratoService } from '../services/serviceContrato.js';


export async function adminContrato() {
let salir = false;
const contratoService = new ContratoService();

while (!salir) {
    const opcion = await mostrarMenuContrato();

    switch (opcion) {
    case '1':
        console.clear();
        await contratoService.crearContrato();
        break;

    case '2':
        console.clear();
        await contratoService.listarContrato();
        break;

    case '3':
        console.clear();
        console.log('casi 3: actualizar contrato');
        break;

    case '4':
        console.clear();
        console.log('casi 4: eliminar contrato');
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
