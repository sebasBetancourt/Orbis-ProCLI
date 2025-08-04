import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuEntregable() {
const { opcion } = await inquirer.prompt([
    {
    type: 'list',
    name: 'opcion',
    message: chalk.bold.bgYellow.black(`📦 Administrar Entregables`),
    choices: [
        { name: chalk.cyan('1. Crear Entregable'), value: '1' },
        { name: chalk.cyan('2. Ver Entregables'), value: '2' },
        { name: chalk.cyan('3. Editar Estado de Entregable'), value: '3' },
        { name: chalk.cyan('4. Eliminar Entregable'), value: '4' },
        { name: chalk.red('0. Atrás'), value: '0' }
    ]
    }
]);
return opcion;
}
