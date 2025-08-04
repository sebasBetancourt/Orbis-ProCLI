import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuTransaccion() {
const { opcion } = await inquirer.prompt([
    {
    type: 'list',
    name: 'opcion',
    message: chalk.bold.bgMagenta(`Administrar Transacciones💰`),
    choices: [
        { name: chalk.cyan('1. Registrar Transacción'), value: '1' },
        { name: chalk.cyan('2. Ver Transacciones'), value: '2' },
        { name: chalk.cyan('3. Calcular Balance'), value: '3' },
        { name: chalk.cyan('4. Eliminar Transacción'), value: '4' },
        { name: chalk.red('0. Atrás'), value: '0' }
    ]
    }
]);
return opcion;
}
