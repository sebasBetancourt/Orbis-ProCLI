import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuEntregables() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.bold.bgMagenta(`Entregables ⚙️​`),
      choices: [
        { name: chalk.cyan('1. Ver entregables'), value: '1' },
        { name: chalk.cyan('2. Crear entregable'), value: '2' },
        { name: chalk.cyan('3. Cambiar estado de entregable'), value: '3' },
        { name: chalk.red('0. Atras'), value: '0' }
      ]
    }
  ]);
  return opcion;
}