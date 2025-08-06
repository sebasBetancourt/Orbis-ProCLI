import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuEstadofinanciero() {
const { opcion } = await inquirer.prompt([
    {
    type: 'list',
    name: 'opcion',
    message: chalk.bold.bgMagenta(`Estado Financiero⚙️`),
    choices: [
        { name: chalk.cyan('1. Total Ingresos'), value: '1' },
        { name: chalk.cyan('2. Total Egresos'), value: '2' },
        { name: chalk.cyan('3. Balance Neto'), value: '3' },
        { name: chalk.red('0. Atrás'), value: '0' }
    ]
    }
]);
return opcion;
}
