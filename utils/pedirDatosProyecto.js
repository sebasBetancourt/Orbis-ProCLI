import inquirer from 'inquirer';
import chalk from 'chalk';

export async function datosProyecto() {
    const { descripcion } = await inquirer.prompt([{
        type: 'input',
        name: 'descripcion',
        message: 'Ingresa la descripción del proyecto: ',
        validate: input => input.trim() ? true : chalk.red.bold('La descripción no puede estar vacía.')
    }]);

    const { valor } = await inquirer.prompt([{
        type: 'number',
        name: 'valor',
        message: 'Ingresa el valor del proyecto: ',
        validate: input => (typeof input === 'number' && input > 0) ? true : chalk.red.bold('El valor debe ser un número positivo.')
    }]);

    const { estado } = await inquirer.prompt([{
        type: 'list',
        name: 'estado',
        message: 'Selecciona el estado inicial del proyecto:',
        choices: ['Activo', 'Pausado', 'Finalizado', 'Cancelado']
    }]);

    return { descripcion, valor, estado };
}