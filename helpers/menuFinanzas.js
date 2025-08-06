import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuFinanza() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.bold.bgMagenta('Administrar Finanzas 💰'),
      choices: [
        { name: chalk.cyan('1. Registrar Ingreso/Egreso'), value: '1' },
        { name: chalk.cyan('2. Ver Finanzas'), value: '2' },
        { name: chalk.cyan('3. Actualizar Registro'), value: '3' },
        { name: chalk.cyan('4. Eliminar Registro'), value: '4' },
        { name: chalk.cyan('5. Calcular Balance'), value: '5' },
        { name: chalk.red('0. Atrás'), value: '0' },
      ],
    },
  ]);
  return opcion;
}