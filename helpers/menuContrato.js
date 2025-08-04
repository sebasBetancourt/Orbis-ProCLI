import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuContrato() {
const { opcion } = await inquirer.prompt([
    {
    type: 'list',
    name: 'opcion',
    message: chalk.bold.bgMagenta(`Administrar Contratos⚙️`),
    choices: [
        { name: chalk.cyan('1. Registrar Contrato'), value: '1' },
        { name: chalk.cyan('2. Ver Contratos'), value: '2' },
        { name: chalk.cyan('3. Editar Contrato'), value: '3' },
        { name: chalk.cyan('4. Eliminar Contrato'), value: '4' },
        { name: chalk.red('0. Atrás'), value: '0' }
    ]
    }
]);
return opcion;
}
