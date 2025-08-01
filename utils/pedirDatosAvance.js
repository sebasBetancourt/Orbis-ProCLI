import inquirer from 'inquirer';
import chalk from 'chalk';

export async function datosAvance() {
    const { descripcion } = await inquirer.prompt([{
        type: 'input',
        name: 'descripcion',
        message: 'Ingresa la descripción del avance: ',
        validate: input => input.trim() ? true : chalk.red.bold('La descripción del avance no puede estar vacía.')
    }]);
    return { descripcion };
}